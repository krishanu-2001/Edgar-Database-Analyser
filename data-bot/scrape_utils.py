from bs4 import BeautifulSoup
import urllib3
import re
import requests
import xml.etree.ElementTree as ET


##########################################################################
"""
This is the dictionary of all the required features mapped with their 
US GAAP standard codes, which is used by the get_table_data function.
"""


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


##########################################################################
"""
This is the dictionary of all the required features which are to be searched
in the text of the SEC filing mapped with list of their key words, which 
is used by the get_text_data function.
"""


text_features = {
    "NetLoss": ["net", "loss"],
    'RecurringRevenue': ['recurring', 'revenue'],
    'ARR': ['arr',],
    "GAAPRevenue": ["gaap", "revenue"],
    "NonGAAPEarnings": ["non", "gaap", "earnings"],
    "MRR": ["mrr",],
}


##########################################################################
"""
This is the header which needs to be passed to the SEC EDGAR website for
retrival of data, documentation can be found on 
https://www.sec.gov/os/webmaster-faq#developers 

The http variable creates a urllib3 PoolManager to efficiently run all the requests
"""


headers = {
    'user-agent': 'Sample @ <sample@sample.com>',
    'host': 'www.sec.gov'
}


http = urllib3.PoolManager()


##########################################################################
"""
get_accn function takes in the CIK of a company, the form type(10-K, 10-Q)
and the year.
It then searches for all the filings of the defined type with 
the range {year}/01/01-{year+1}/01/01 (YYYY/MM/DD) and returns the
accession number and the date of filing for each filing.
"""


def get_accn(cik, form, year):

    endpoint = "https://www.sec.gov/cgi-bin/browse-edgar"       #endpoint of the search
    param = {'action': 'getcompany',                            #parameter of the search
            'CIK': cik,
            'type': form,
            'dateb': f"{year+1}0101",
            'datea': f"{year}0101",
            'owner': 'exclude',
            'output': 'atom',
            'count': '100',
        }
    response = requests.get(url=endpoint, params=param, headers=headers)    #It sends a get request with the defined parameter and headers
    tree = ET.ElementTree(ET.fromstring(response.text))                     
    root = tree.getroot()
    accn_date_list = []
    for child in root.findall("{http://www.w3.org/2005/Atom}entry"):        # Search for all the filing entries
        try:   
            accn = child.find("{http://www.w3.org/2005/Atom}content").find("{http://www.w3.org/2005/Atom}accession-number").text.replace("-", "")
            date = child.find("{http://www.w3.org/2005/Atom}content").find("{http://www.w3.org/2005/Atom}filing-date").text
            accn_date_list.append((accn, date))
        except: continue
    return accn_date_list


##########################################################################
"""
get_doc_url function takes in the CIK of a company, the accession number of
the filing and the form type(10-K, 10-Q). 
It then searches inside the FilingSummary.xml file for the filing document
and sets the parse_method to htm or xml according to filing document format
and also searches for the Individual Reports of the SEC filing.

It returns the url of the filing document and a list of all the 
Individual Report Names and their URLs.
"""


def get_doc_url(cik, accn, form):
    base_url = "https://www.sec.gov/Archives/edgar/data/"
    gen_url = base_url + "{}/{}/".format(cik, accn)                     # URL for the SEC filing directory
    xml_summary = gen_url + "FilingSummary.xml"
    content = requests.get(xml_summary, headers=headers).content
    soup = BeautifulSoup(content, features='lxml')
    inputfiles = soup.find('inputfiles')
    htm_doc = inputfiles.find_all("file", attrs={"doctype": form})
    if len(htm_doc) >0:
        file_name = (htm_doc[0]).text
        doc_url = gen_url + file_name                                   # SEC filing document URL
        parse_method = "htm"
    else:
        xml_doc = inputfiles.find_all("file")
        file_name = (xml_doc[0]).text
        doc_url = gen_url + file_name                                   # SEC filing document URL
        parse_method = "xml"
    reports = soup.find('myreports')
    sec_tables = []
    for report in reports.find_all('report')[:-1]:
        sec_table = dict()
        sec_table['name'] = report.shortname.text.replace(" ", "_")
        sec_table['url'] = gen_url + report.htmlfilename.text
        sec_tables.append(sec_table)                                    # Appends a map of the name and url of the individual report to the list
    return (doc_url, sec_tables, parse_method)


##########################################################################
"""
get_text_data function takes in the BeautifulSoup parsed htm document of 
a filing. 
It then finds all the <span> and <p> tags in the file and stores it, then
it takes a feature from the text_features dictionary and searches for all 
the words of a particular feature in each and every line of each and every
paragraph. It then uses regex to extract the numeric value and it's 
multiplier(billion, million, thousand, hundred) and add it to a list. 
It then makes final value of each item in the list and puts in the 
maximum value of the all the instances to the final value dictionary.
If a particular value is not found it fills NaN value.

It returns a dictionary of all the text_features mapped to it's value.
"""

def get_text_data(doc_soup):
    text_data = dict()
    paras = doc_soup.find_all(["span", "p"])
    for text_feature in text_features.keys():                           # Iterates through the keys of text_features
        try:
            temp_array = []
            final_values = []
            for para in paras:                                          # Iterates through each paragraph of the file
                lines = para.text.lower().split(". ")                   # Split each line of the paragraph
                for line in lines:
                    flag = True                                         
                    for word in text_features[text_feature]:            # Iterates through the keywords of text_feature
                        if word.lower() not in line:                    # If any keyword is not found it flags false and
                            flag = False                                # breaks the loop 
                    if flag:
                        match = re.findall('\$([0-9\.\,]*)\s(billion|million|thousand|hundred)', line)
                        if len(match)>0:
                            temp_array.append(f'{match[0][0].replace(",","")} {match[0][1]}')
            for figure in text_feature:
                try:
                    num, multiplier = figure.split(" ")                 # Splits the num and multiplier
                    if multiplier == "billion":                         # Checks for different mulipliers
                        num = float(num)*1000000000                     # and sets a value accordingly
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
    for text_feature in text_features.keys():                           # If any value is not found
        text_data[text_feature] = text_data.get(text_feature,"NaN")     # it sets a NaN value for it
    return text_data


##########################################################################
"""
get_table_data function takes in the BeautifulSoup parsed htm document of 
a filing, it's year, form type, parse_method and spec(special variable) defaulted
to 0. If spec parameter is used then form and year is of no use in this function.
spec parameter is the Reporting date of the filing and if it is extracted 
successfully in the scrape.py, it is used in the main logic of this function.

It then iterates over the features dictionary and checks for all the property
according to US GAAP standard in the XBRL Non-Fraction values for the given
features. Then if the spec property is non zero it uses spec value to check 
in the contextref attribute of the tags for the matching the date of the value.
If spec property is 0 or it cannot match the date it checks for year passed in
in the context ref and then year-1 and then year+1 and takes the appropriate value
along with the scale(multiplier) and sign(+ve or -ve) and appends it to a list.
It then takes in the maximum value of from the list and sets the value to the
particular feature and sets NaN if no value is obtained.

It then returns the dictionary with features mapped to their values.
"""


def get_table_data(doc_soup, year, form, parse_method, spec=0):
    if form == "10-K":
        year +=1
    table_data = dict()
    for feature in features.keys():
        try:      
            if parse_method=="htm":
                value = doc_soup.find_all(re.compile("ix:nonfraction", re.I), {"name": re.compile(f"{features[feature]}", re.I)})
            else:
                value = doc_soup.find_all(re.compile(f"{features[feature]}", re.I))
            values = []
            for i in value:  
                if i.has_attr("contextref"):
                    contextref = "contextref"
                elif i.has_attr("contextRef"):
                    contextref = "contextRef"     
                try:
                    if spec==0:                        
                        if str(year) in i[contextref]:    
                            if i.has_attr("sign"):                                              # It checks if sign attribute exists or not
                                if i.has_attr("scale"):                                         # If exists it checks for scale attribute
                                    values.append(float(i["sign"]+i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i["sign"]+i.text.replace(",","")))
                            else:
                                if i.has_attr("scale"):
                                    values.append(float(i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i.text.replace(",","")))
                        elif str(year-1) in i[contextref]: 
                            if i.has_attr("sign"):
                                if i.has_attr("scale"):
                                    values.append(float(i["sign"]+i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i["sign"]+i.text.replace(",","")))
                            else:
                                if i.has_attr("scale"):
                                    values.append(float(i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i.text.replace(",","")))
                        elif str(year+1) in i[contextref]: 
                            if i.has_attr("sign"):
                                if i.has_attr("scale"):
                                    values.append(float(i["sign"]+i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i["sign"]+i.text.replace(",","")))
                            else:
                                if i.has_attr("scale"):
                                    values.append(float(i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(+i.text.replace(",","")))
                    else:
                        if spec.replace("-","") in i[contextref].replace("-",""):             # It removes - from both spec and contextref and checks if spec is in contextref
                            if i.has_attr("sign"):
                                if i.has_attr("scale"):
                                    values.append(float(i["sign"]+i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i["sign"]+i.text.replace(",","")))
                            else:
                                if i.has_attr("scale"):
                                    values.append(float(i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i.text.replace(",","")))
                        elif str(year) in i[contextref]:    
                            if i.has_attr("sign"):
                                if i.has_attr("scale"):
                                    values.append(float(i["sign"]+i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i["sign"]+i.text.replace(",","")))
                            else:
                                if i.has_attr("scale"):
                                    values.append(float(i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i.text.replace(",","")))
                        elif str(year-1) in i[contextref]: 
                            if i.has_attr("sign"):
                                if i.has_attr("scale"):
                                    values.append(float(i["sign"]+i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i["sign"]+i.text.replace(",","")))
                            else:
                                if i.has_attr("scale"):
                                    values.append(float(i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i.text.replace(",","")))
                        elif str(year+1) in i[contextref]: 
                            if i.has_attr("sign"):
                                if i.has_attr("scale"):
                                    values.append(float(i["sign"]+i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(i["sign"]+i.text.replace(",","")))
                            else:
                                if i.has_attr("scale"):
                                    values.append(float(i.text.replace(",","")+"0"*int(i["scale"])))
                                else:
                                    values.append(float(+i.text.replace(",","")))
                except:
                    continue
            if len(values)!=0:
                if max(values)<0:
                    table_data[feature] = table_data.get( feature , min(values))
                else:
                    table_data[feature] = table_data.get( feature , max(values))
            else:                                                       # If any value is not found
                table_data[feature] = table_data.get(feature, "NaN")    # it sets a NaN value for it
        except:
            continue
    return table_data


##########################################################################
"""
get_meta_stock function takes in the CIK of a company.
Then it use REFINITIV's PERMID Search API to search for the given CIK and then
it uses the returned response Entites field in the REFINITIV's PERMID LOOKUP API
to get all the meta_data properties and Quote URL, then it uses
REFINITIV's PERMID Quote Lookup API to get the ticker and exchange details of 
the company. It then uses that ALPHAVANTAGE to get monthly time series of the
company's stock price.
It returns the fetched meta_data and stock price timeseries.  
"""


def get_meta_stock(cik):
    data = dict()
    stock_data = dict()
    try:
        token = "OPFbGvwobBxjrx0M6MSWMMvFgtz7DKKp"                              # REFINITIV API Token

        metadata_prop = {'vcard:organization-name': "CompanyName",              # Refinitiv Properties mapped
                        'hasURL': "URL",                                        # with Schema Properties
                        'mdaas:HeadquartersAddress': "Address",
                        'tr-org:hasHeadquartersFaxNumber': "FaxNumber",
                        'tr-org:hasHeadquartersPhoneNumber': "PhoneNumber",
                        'hasHoldingClassification': "HoldingType",
                        'hasIPODate': "IPODate"}

        l = len(str(cik))
        cik = "0"*(10-l)+str(cik)
        perm_id = requests.get("https://api-eit.refinitiv.com/permid/search?q=cik:{}&access-token={}".format(cik, token))
        if len(perm_id.json()['result']['organizations']['entities'])>0:
            perm_id_req = requests.get(perm_id.json()['result']['organizations']['entities'][0]['@id'], headers={
                                    "Accept": "application/ld+json", "x-ag-access-token": token})
            perm_data = perm_id_req.json()
            if "hasOrganizationPrimaryQuote" in perm_data.keys():
                quote_detail = requests.get(perm_data["hasOrganizationPrimaryQuote"], headers={"Accept": "application/ld+json", "x-ag-access-token": token})
                ticker = quote_detail.json()["tr-fin:hasExchangeTicker"]
                exchange = quote_detail.json()['tr-fin:hasExchangeCode']
                data["ticker"] = ticker
                data["exchange"] = exchange
                alpha_token = "XZVMA05SP371BARG"                             # ALPHAVANTAGE API Token
                url = f'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol={ticker}&apikey={alpha_token}'
                data_req = requests.get(url)
                stock_data = data_req.json()['Monthly Time Series']
                for prop in metadata_prop.keys():
                    try:
                        if prop == 'hasHoldingClassification':
                            if 'public' in perm_data[prop]:
                                data[metadata_prop[prop]] = "Public"
                        elif prop == "mdaas:HeadquartersAddress":
                            data[metadata_prop[prop]] = perm_data[prop].replace("\n", " ")
                        else:
                            data[metadata_prop[prop]] = perm_data[prop]
                    except:
                        continue
                for prop in metadata_prop.keys():
                    data[metadata_prop[prop]] = data.get(metadata_prop[prop], 'NaN') 
            else:
                for prop in metadata_prop.keys():
                    data[metadata_prop[prop]] = data.get(metadata_prop[prop], 'NaN') 
                data["ticker"] = "NaN"
                data["exchange"] = "NaN"
        else:
            for prop in metadata_prop.keys():
                data[metadata_prop[prop]] = data.get(metadata_prop[prop], 'NaN') 
            data["ticker"] = "NaN"
            data["exchange"] = "NaN"
    except:
        for prop in metadata_prop.keys():
            data[metadata_prop[prop]] = 'NaN'
        stock_data = dict()
    return (data, stock_data)

##########################################################################