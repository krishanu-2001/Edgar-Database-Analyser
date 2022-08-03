from bs4 import BeautifulSoup
import urllib3
import requests
import xml.etree.ElementTree as ET
import re
from dateutil import parser


sentiment_features = ('$','%','unit','ten','hundred','thousand','million','billion','revenue','loss','profit',
                        'growth','potential','income','percent','customer') #List of keywords used in order to extract the text from 8K forms

headers = {
    'user-agent': 'Sample @ <sample@sample.com>',
    'host': 'www.sec.gov'
}

##########################################################################
'''In this function, we scrape the SEC Edgar database for a given company
and for a given date range and obtain all the 8K forms filed by this company
within this date range. We then use a list of keywords in order to select specific parts of the 
text that may provide a significant amount of financial information about the company
'''

def get_scrape_text(cik, form, datea, dateb):
    final_sentences = []

    endpoint = "https://www.sec.gov/cgi-bin/browse-edgar" #url of endpoint for performing the search
    base_url = "https://www.sec.gov/Archives/edgar/data/"
    param = {'action': 'getcompany',
            'CIK': cik,
            'type': form,
            'dateb': dateb,
            'datea': datea,
            'owner': 'exclude',
            'output': 'atom',
            'count': '100',
            }
    
    response = requests.get(url=endpoint, params=param, headers=headers)  #It sends a get request with the defined parameter and headers
    tree = ET.ElementTree(ET.fromstring(response.text))
    root = tree.getroot()
    for child in root.findall("{http://www.w3.org/2005/Atom}entry"): # Search for all the filing entries
        try:   
            accn = (child.find("{http://www.w3.org/2005/Atom}content")
                    ).find("{http://www.w3.org/2005/Atom}accession-number").text
            gen_url = base_url + "{}/{}/".format(cik, accn.replace("-", ""))  # URL for the SEC filing directory
            xml_summary = gen_url + "FilingSummary.xml" 
            content = requests.get(xml_summary, headers=headers).content  
            soup = BeautifulSoup(content, features='lxml')
            reports = soup.find('inputfiles')
            
            htm_doc = reports.find_all("file", attrs={"doctype": form})
            if len(htm_doc)>0:
                parse_method = "htm"
            else:
                parse_method = "xml"

            file_name = (reports.find_all("file", attrs={"doctype": form})[0]).text
            doc_url = gen_url + file_name  # SEC filing document URL
            http = urllib3.PoolManager()
            req = http.request("GET",doc_url,headers=headers)
            docsoup = BeautifulSoup(req.data, features='lxml')

            if parse_method=="htm":
                filing_for_date_tag = docsoup.find_all("ix:nonnumeric", {"name": "dei:DocumentPeriodEndDate"})
            else:
                filing_for_date_tag = docsoup.find_all(re.compile("dei:DocumentPeriodEndDate", re.I))
            if len(filing_for_date_tag)>0:
                try:
                    date_text = filing_for_date_tag[0].text.replace("&nbsp;", " ")
                    date_text = parser.parse(date_text).strftime('%Y-%m-%d')
                    # print(date_text)
                except Exception as e:
                    print("Date error ",e)

            text_tags = docsoup.find_all(["span", "p","font","li"]) #Extract all the tags which contain text in the form
            anchor_tags = docsoup.find_all(["a"]) #This is used to extract the link of a press release issued by the company


            for tag in text_tags:  
                #This loops through all the tags which may contain textual data in the form
                try:
                    txt = tag.text.lower()
                    
                    if len(txt.split(' '))<=5: #Short sentences are ignored
                        continue

                    valid = False
                    for feature in sentiment_features: #We check if the extracted text contains any keyword from the list defined above
                        if feature in txt:
                            valid = True
                            break


                    if 'check mark' in txt: 
                        valid = False
                    
                    #Now we have validated the sentence, hence we put it into the list of final sentences
                    if valid==True: 
                        txt = txt.encode("utf-8")
                        txt = txt.decode("utf-8","ignore")
                        final_sentences.append({'sentence':txt,'date':date_text})
                        # print(txt)
                except Exception as e:
                    continue

            for anchor_tag in anchor_tags:
                #Checks all the anchor tags in the form to see if the company has provided a link to its press release
                try:
                    txt = anchor_tag.text.lower()
                    if ('press' in txt) and ('release' in txt):
                        #We have found a section of the form containing details about a press release
                        press_release_filename = anchor_tag['href'] #We extract the link of the press releaase
                        press_release_url = gen_url + press_release_filename
                        pr_req = http.request("GET",press_release_url,headers=headers)
                        press_release_docsoup = BeautifulSoup(pr_req.data, features='lxml')
                        press_release_text_tags = press_release_docsoup.find_all(["span", "p","font","li"])

                        #We obtain the press release document from the obtained link and then extract the 
                        #text tags from this document, similar to what we did for the text tags in the 
                        #8k filing document

                        for tag in press_release_text_tags:
                            #This loops through all the tags which may contain textual data in the press release
                            txt = tag.text.lower()

                            if len(txt.split(' '))<=5: #Short sentences are ignored
                                continue

                            valid = False
                            for feature in sentiment_features:  #We check if the extracted text contains any keyword from the list defined above
                                if feature in txt:
                                    valid = True
                                    break

                            if 'check mark' in txt:
                                valid = False
                            
                            #Now we have validated the sentence, hence we put it into the list of final sentences
                            if valid==True:
                                txt = txt.encode("utf-8")
                                txt = txt.decode("utf-8","ignore")
                                final_sentences.append({'sentence':txt,'date':date_text})
                                # print(txt)
                except Exception as e:
                    continue

        except Exception as e:
            continue

    return final_sentences