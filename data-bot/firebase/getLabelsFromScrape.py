import json
import firebase_admin
import pandas as pd
from firebase_admin import credentials, firestore
from scrape import get_data

import access_util as au
epsilon = 1e-20

cred = credentials.Certificate('../serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# all collections
# for doc in db.collections():
#     print(u'{}'.format(doc.id))

myCollection = db.collection("company")
company_list = []
for doc in myCollection.stream():
    company_list.append(doc.id)
    # print(u'{} => {}'.format(doc.id, doc.to_dict()))

# cik list from csv    
comps = pd.read_csv('..\csv\GoodCom.csv')
company_list = comps['CIK'].to_numpy().astype('int').astype('str')

print("company_list cik numbers:")
print(company_list)

# all documents.collections
count_to_display = 1000
netcsv = []
netvalues = []
for cik in company_list:
    if count_to_display == 0: break
    for date in ("2021", "2020"):
        print(f"year: {date}, cik = {cik}")
        # x = myCollection.document(cik).collection("10k").document(date).get()
        try:
            x = get_data(cik, "10-K", int(date))
            cur = x[(date)]
            keys = x.keys()
            # print(cur)
            # print(f"{cik} + {date} has : {cur['MarketableSecurities']}")
            prevDate = int(date) - 1
            try:
                # y = myCollection.document(cik).collection("10k").document(prevDate).get()
                y = get_data(cik, "10-K", int(prevDate))
                prev = y[(prevDate)]
            except:
                y = x
                prev = y[(date)]
        except:
            continue
        # use cur and prev to get ratios and label company
        rf = au.ratios

        # print(cur, prev)
        ratios, rato = rf.setup_ratios(cur, prev)

        ratiodf= pd.DataFrame(cur.items())
        ratiodf, ratiodf.columns= ratiodf.T, cur.keys()
        ratiodf.drop(index=ratiodf.index[0],axis=0, inplace=True)

        rider_provider = cik + '_' + date
        rato.insert(0,'rider_provider', rider_provider)
        rato.set_index('rider_provider')
        ratiodf.insert(0,'rider_provider', rider_provider)
        ratiodf.set_index('rider_provider')
        # print(rato.iloc[:,-13:])
        # print(rato)
        netcsv.append(rato)
        netvalues.append(ratiodf)

    count_to_display -= 1

# print(netcsv)
result = pd.concat(netcsv)
# print(result)
result.to_csv("labels.csv", index = True) 

result = pd.concat(netvalues)
# print(result)
result.to_csv("data_values.csv", index = True) 






'''
parameters in firebase
dict_keys(['MRR', 
'TotalOperatingExpenses', 
'SalesCost', 
'MarketableSecurities', 
'Non-GAAPEarnings', 
'GAAPRevenue', 
'CustomerChurn', 
'CostOfSales', 
'SharesOutstanding', 
'Revenues', 
'NetOperatingExpenses', 
'StockPrice', 
'TotalPropertyAndEquipment', 
'RecurringRevenue', 
'ARR', 
'Inventories', 
'CustomerAcquisitionCosts', 
'SubscriberChurn', 
'OperatingIncome', 
'EBITDA', 
'SubscriptionRevenue', 
'RevenueChurn', 
'GrossProfit'])
'''

'''
Needed
"2020_3": {
        "CashAndCashEquivalents": 730506000.0,
        "MarketableSecurities": 1141425000.0,
        "TotalCurrentAssets": 2624276000.0,
        "TotalAssets": 3050311000.0,
        "PropertyAndEquipmentNet": 108077000.0,
        "Goodwill": 24340000.0,
        "TotalCurrentLiabilities": 1413948000.0,
        "SharesOutstanding": 198179809.0,
        "TotalStockholdersEquity": 1499918000.0,
        "TotalEquity": 3050311000.0,
        "GrossProfit": 1214178000.0,
        "TotalOperatingExpenses": 810447000.0,
        "NetIncome": 411706000.0,
        "GrossPropertyAndEquipment": 151727000.0,
        "StockPrice": "NaN",
        "SalesAndMarketing": 470886000.0,
        "TotalDebt": "NaN",
        "Revenues": 1768883000.0,
        "CostOfSales": 554705000.0,
        "OperatingIncome": 403731000.0,
        "NetLoss": "NaN",
        "RecurringRevenue": "NaN",
        "ARR": "NaN",
        "GAAPRevenue": "NaN",
        "NonGAAPEarnings": "NaN",
        "MRR": "NaN",
        "date": "2020-12-04",
        "doc_url": "https://www.sec.gov/Archives/edgar/data/1585521/000158552120000299/zm-20201031.htm"
    },
'''
