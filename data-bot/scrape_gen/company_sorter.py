import requests
import xml.etree.ElementTree as ET
import pandas as pd


##########################################################################
"""
It reads in a CSV containing all the Companies and their CIK
and then it drops any NA value in it.

It is the header which needs to be passed to the SEC EDGAR website
for retrival of data, documentation can be found on 
https://www.sec.gov/os/webmaster-faq#developers 
"""


companies = pd.read_csv("./csv/CIK_278.csv")
companies = companies.dropna()

headers = {
    'user-agent': 'Sample @ <sample@sample.com>',
    'host': 'www.sec.gov'
}


##########################################################################
"""
It creates a dictionary with CIKs mapped to company names and creates two
empty dictionaries.
"""


company_dict = companies.set_index("CIK").T.to_dict()

bad_company_dict = dict()
good_company_dict = dict()


##########################################################################
"""
get_data takes in the CIK of a company, the type of form, datea(date after)
and dateb(date before). It then sends a request to SEC to get the filings 
If the number of filing between the dates is zero it returns True else it 
returns False
"""


def get_data(cik, type, datea, dateb):
    endpoint = "https://www.sec.gov/cgi-bin/browse-edgar"
    param = {'action': 'getcompany',
             'CIK': cik,
             'type': type,
             'dateb': dateb,
             'datea': datea,
             'owner': 'exclude',
             'output': 'atom',
             'count': '100',
             }
    response = requests.get(url=endpoint, params=param, headers=headers)
    tree = ET.ElementTree(ET.fromstring(response.text))
    root = tree.getroot()
    if len(root.findall("{http://www.w3.org/2005/Atom}entry")) == 0:
        return True
    else:
        return False


##########################################################################
"""
It checks for all companies in company_dict, if the number of 10-K filing
between 2020-01-01 to 2022-03-03 is zero it classify it as a bad
company else as a good company. It then writes two csv files GoodCom.csv
and BadCom.csv with the sorted company details.
"""


for cik in list(company_dict.keys()):
    if get_data(int(cik), "10-K", "20200101", "20220303"):
        bad_company_dict[cik] = company_dict[cik]['CompanyName']
    else:
        good_company_dict[cik] = company_dict[cik]['CompanyName']

good_company_df = pd.DataFrame(good_company_dict.items(),columns=["CIK","CompanyName"])
good_company_df = good_company_df.astype({"CIK": int})
good_company_df = good_company_df.set_index("CIK")
good_company_df.to_csv("./csv/GoodCom.csv")

bad_company_df = pd.DataFrame(bad_company_dict.items(),columns=["CIK","CompanyName"])
bad_company_df = bad_company_df.astype({"CIK": int})
bad_company_df = bad_company_df.set_index("CIK")
bad_company_df.to_csv("./csv/BadCom.csv")


##########################################################################