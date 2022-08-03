from bs4 import BeautifulSoup
import urllib3
import re
import requests
import xml.etree.ElementTree as ET

features = {
    "CashAndCashEquivalents": "us-gaap:CashAndCashEquivalentsAtCarryingValue",
    "MarketableSecurities": "us-gaap:AvailableForSaleSecuritiesDebtSecurities",
    "TotalCurrentAssets": "us-gaap:AssetsCurrent",
    "TotalAssets": "us-gaap:Assets",
    "PropertyAndEquipmentNet": "us-gaap:PropertyPlantAndEquipmentNet",
    "Goodwill": "us-gaap:Goodwill",
    "TotalCurrentLiabilities": "us-gaap:LiabilitiesCurrent",
    "SharesOutstanding": "us-gaap:CommonStockSharesOutstanding",
    "TotalStockholdersEquity": "us-gaap:StockholdersEquity",
    "TotalEquity": "us-gaap:LiabilitiesAndStockholdersEquity",
    "GrossProfit": "us-gaap:GrossProfit",
    "TotalOperatingExpenses": "us-gaap:OperatingExpenses",
    "NetIncome": "us-gaap:NetIncomeLoss",
    "GrossPropertyAndEquipment": "us-gaap:PropertyPlantAndEquipmentGross",
    "StockPrice": "us-gaap:SharePrice",
    "SalesAndMarketing": "us-gaap:SellingAndMarketingExpense",
    "TotalDebt": "us-gaap:LongTermDebtAndCapitalLeaseObligations",
    "Revenues": "us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax",
    "CostOfSales": "us-gaap:CostOfGoodsAndServicesSold",
    "OperatingIncome": "us-gaap:OperatingIncomeLoss",
}

text_features = {
    "NetLoss": ["net", "loss"],
    'RecurringRevenue': ['recurring', 'revenue'],
    'ARR': ['arr',],
    "GAAPRevenue": ["gaap", "revenue"],
    "NonGAAPEarnings": ["non", "gaap", "earnings"],
    "MRR": ["mrr",],
}

headers = {
    'user-agent': 'Sample @ <sample@sample.com>',
    'host': 'www.sec.gov'
}


http = urllib3.PoolManager()

def get_accn(cik, form, year):
    endpoint = "https://www.sec.gov/cgi-bin/browse-edgar"
    param = {'action': 'getcompany',
            'CIK': cik,
            'type': form,
            'dateb': f"{year+1}0101",
            'datea': f"{year}0101",
            'owner': 'exclude',
            'output': 'atom',
            'count': '100',
        }
    response = requests.get(url=endpoint, params=param, headers=headers)
    tree = ET.ElementTree(ET.fromstring(response.text))
    root = tree.getroot()
    accn_date_list = []
    for child in root.findall("{http://www.w3.org/2005/Atom}entry"):
        try:   
            accn = child.find("{http://www.w3.org/2005/Atom}content").find("{http://www.w3.org/2005/Atom}accession-number").text.replace("-", "")
            date = child.find("{http://www.w3.org/2005/Atom}content").find("{http://www.w3.org/2005/Atom}filing-date").text
            accn_date_list.append((accn, date))
        except: continue
    return accn_date_list

def get_doc_url(cik, accn, form):
    base_url = "https://www.sec.gov/Archives/edgar/data/"
    gen_url = base_url + "{}/{}/".format(cik, accn)
    xml_summary = gen_url + "FilingSummary.xml"
    content = requests.get(xml_summary, headers=headers).content
    soup = BeautifulSoup(content, features='lxml')
    reports = soup.find('inputfiles')
    file_name = (reports.find_all("file", attrs={"doctype": form})[0]).text
    doc_url = gen_url + file_name
    return doc_url

def get_text_data(doc_soup):
    text_data = dict()
    for text_feature in text_features.keys():
        try:
            temp_array = []
            final_values = []
            value2 = doc_soup.find_all(["span", "p"])
            for para in value2:
                lines = para.text.lower().split(". ")
                for line in lines:
                    flag = True
                    for word in text_features[text_feature]:
                        if word.lower() not in line:
                            flag = False
                    if flag:
                        match = re.findall('\$([0-9\.\,]*)\s(billion|million|thousand|hundred)', line)
                        if len(match)>0:
                            temp_array.append(f'{match[0][0].replace(",","")} {match[0][1]}')
            for figure in text_feature:
                try:
                    num, multiplier = figure.split(" ")
                    if multiplier == "billion":
                        num = float(num)*1000000000
                    elif multiplier == "million":
                        num = float(num)*1000000
                    elif multiplier == "thousand":
                        num = float(num)*1000
                    elif multiplier == "hundred":
                        num = float(num)*100
                    else:
                        num = float(num)
                        final_values.append(num)
                    final_values=set(final_values)
                    if len(final_values)==1:
                        text_data[text_feature] = text_data.get(text_feature,list(final_values)[0])
                    elif len(final_values)>1:
                        text_data[text_feature] = text_data.get(text_feature,max(list(final_values)))
                except:
                    continue
        except:
            continue
        for text_feature in text_features.keys():
            text_data[text_feature] = text_data.get(text_feature,"NaN")
    return text_data

def get_table_data(doc_soup, year):
    table_data = dict()
    for feature in features.keys():
        try:            
            value = doc_soup.find_all("ix:nonfraction", {"name": features[feature]})
            values = []
            for i in value:
                try:
                    if str(year) in i["contextref"]:
                        if i.has_attr("sign"):
                            values.append(float(i["sign"]+i.text.replace(",","")+"0"*int(i["scale"])))
                        else:
                            values.append(float(i.text.replace(",","")+"0"*int(i["scale"])))
                except:
                    continue
            if len(values)!=0:
                table_data[feature] = table_data.get( feature , max(values))
            else: 
                table_data[feature] = table_data.get(feature, "NaN")
        except:
            continue
    return table_data

def get_data(cik, form, year):
    feature_dict = dict()
    quarter = 3
    accn_date_list = get_accn(cik, form, year)
    for accn, date in accn_date_list:
        data = dict()
        try:
            data["FilingDate"] = date

            data["DocURL"] = get_doc_url(cik, accn, form)

            req = http.request("GET",data["DocURL"],headers=headers)
            doc_soup = BeautifulSoup(req.data, features='lxml')
            
            table_data = get_table_data(doc_soup, year)
            text_data = get_text_data(doc_soup)

            data = {**table_data, **text_data, **data}

            if form=="10-Q":
                feature_dict[f"{year}_{quarter}"] = data
                quarter -= 1 
            else:
                feature_dict[f"{year}"] = data

        except: continue
    return feature_dict

# import json
# with open('./json/newSchema_10k.json','w') as f:
#     json.dump(get_data(1585521, "10-K", 2020), f, indent=4)
