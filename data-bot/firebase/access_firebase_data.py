import json
import firebase_admin
from firebase_admin import credentials, firestore
import access_util as au
import pandas as pd
epsilon = 1e-20

cred = credentials.Certificate('../sass-db-firebase-adminsdk-4gh5l-4b1dd3dc87.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

companies = pd.read_csv("../csv/GoodCom.csv")
ciks = companies["CIK"].astype(int).tolist()
    # print(u'{} => {}'.format(doc.id, doc.to_dict()))

netcsv = []
netvalues = []

for cik in ciks:
    try:
        docs = db.collection("company").document(str(cik)).collection("_10k").stream()
        docs_dict = dict()
        for doc in docs:
            docs_dict[doc.id] = doc.to_dict()["features"]
        for doc_id in docs_dict.keys():
            date = doc_id.split("-")[0]
            prevdate = int(date) - 1
            cur = docs_dict[doc_id]
            keys = cur.keys()
            flag = False
            for checkdoc in docs_dict.keys():
                if str(prevdate) in checkdoc and not flag:
                    prev = docs_dict[checkdoc]
                    flag = True
            if not flag:
                prev = cur
            rf = au.ratios
            ratios, rato = rf.setup_ratios(cur, prev)
            
            rato.insert(0,"cik_date",f"{cik}_{date}")
            rato = rato.set_index("cik_date")
            netcsv.append(rato)

    except: continue

result = pd.concat(netcsv)
result.to_csv("labelsfinal.csv", index = True) 

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
