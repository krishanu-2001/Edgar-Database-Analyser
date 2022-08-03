import scrape_utils
from bs4 import BeautifulSoup
import urllib3
from dateutil import parser
import re


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
get_data function takes in the CIK of a company.
It calls the functions defined in the scrape_utils file.
Firstly it calls the get_meta_stock function and passes the CIK of the 
company, then for each form type in each year it calls the 
get_accn function, with that it gets accession number and date of
filings. Then for each accession number it calls the get_doc_url
function to get the Filing Document URL and Individual Reports.
It then uses Beautiful Soup to parse the HTM or XML document according
to the parse_method value and finds in Filing for Date in the document.
If it finds it tries to parse the date in YYYY-MM-DD format and then sends
it in the get_table_data as the spec parameter. If the parsing is not
successful it saves the unparsed date or if the date is not found get_table_data
is called without spec parameter. It then calls the get_text_data function. 
If the Stock price is not found in the filing report and stock_prices
is returned by the get_meta_stock function, it finds the stock price 
through that data. It then binds the complete data and returns it in the 
{"form-type":{"year":{data}}}
"""


def get_data(cik):
    meta_data, stock_prices = scrape_utils.get_meta_stock(cik)
    years = [2022,2021,2020,2019]
    forms = {"10-K": "_10k", "10-Q" : "_10q"}
    form_data = dict()
    for form in forms.keys():
        try:
            year_wise_data = dict()
            for year in years:
                try:
                    accn_date_list = scrape_utils.get_accn(cik, form, year)
                    quarter = 3
                    for accn, date in accn_date_list:
                        data = dict()
                        complete_data = dict()
                        try:
                            complete_data["FilingDate"] = date
                            complete_data["DocURL"], filing_data, parse_method = scrape_utils.get_doc_url(cik, accn, form)

                            req = http.request("GET",complete_data["DocURL"],headers=headers)
                            doc_soup = BeautifulSoup(req.data, features='lxml')

                            if parse_method=="htm":
                                filing_for_date_tag = doc_soup.find_all("ix:nonnumeric", {"name": "dei:DocumentPeriodEndDate"})
                            else:
                                filing_for_date_tag = doc_soup.find_all(re.compile("dei:DocumentPeriodEndDate", re.I))
                            if len(filing_for_date_tag)>0:
                                try:
                                    date_text = filing_for_date_tag[0].text.replace("&nbsp;", " ")
                                    complete_data["FilingForDate"] = parser.parse(date_text).strftime('%Y-%m-%d')
                                    table_data = scrape_utils.get_table_data(doc_soup, year, form, parse_method, complete_data["FilingForDate"])
                                except:
                                    complete_data["FilingForDate"] = filing_for_date_tag[0].text
                                    table_data = scrape_utils.get_table_data(doc_soup, year, form, parse_method)
                            else:
                                complete_data["FilingForDate"] = "NaN"
                                table_data = scrape_utils.get_table_data(doc_soup, year, form, parse_method)
                            
                            text_data = scrape_utils.get_text_data(doc_soup)

                            if table_data['StockPrice'] == "NaN" and bool(stock_prices):
                                if bool(re.match('[\d/-]', complete_data["FilingForDate"])):
                                    check_list = complete_data["FilingForDate"].split("-")
                                    for stock_date in stock_prices.keys():
                                        stock_date_split = stock_date.split("-")
                                        if check_list[0] == stock_date_split[0] and check_list[1] == stock_date_split[1]:
                                            table_data['StockPrice'] = float(stock_prices[stock_date]['4. close'])             
                                elif form == "10-K":
                                    for stock_date in stock_prices.keys():
                                        try:
                                            if stock_date.split("-")[1] == '01' and stock_date.split("-")[0] == str(year+1):
                                                table_data['StockPrice'] = float(stock_prices[stock_date]['4. close'])
                                                break
                                        except: continue
                                elif form == "10-Q":
                                    stock_quarter = ["04", "07", "10"]
                                    for stock_date in stock_prices.keys():
                                        try:
                                            if stock_date.split("-")[1] == stock_quarter[quarter-1] and stock_date.split("-")[0] == str(year):
                                                table_data['StockPrice'] = float(stock_prices[stock_date]['4. close'])
                                                break
                                        except: continue

                            data = {**table_data, **text_data, **data}
                            threshold = 0
                            for data_feature in data.keys():
                                if data[data_feature]=="NaN":
                                    threshold+=1
                            if threshold>=23:
                                continue
                            complete_data["features"] = data
                            complete_data["sec_filing"] = filing_data
                            
                            if complete_data["FilingForDate"] != "NaN":
                                key = complete_data["FilingForDate"]
                                year_wise_data[f"{key}"] = complete_data
                            elif complete_data["FilingDate"] != "NaN":
                                complete_data["FilingDate"]
                                year_wise_data[f"{key}"] = complete_data
                            else:
                                if form=="10-Q":
                                    year_wise_data[f"{year}_{quarter}"] = complete_data
                                    quarter -= 1 
                                else:
                                    year_wise_data[f"{year}"] = complete_data
                            print(f"ACCN:{accn}, FORM: {form}, YEAR: {year}, CIK: {cik} DONE")
                        except: continue  
                except: continue
            form_data[forms[form]] = year_wise_data
        except: continue
    companies_data = {**meta_data, **form_data}
    return companies_data


##########################################################################