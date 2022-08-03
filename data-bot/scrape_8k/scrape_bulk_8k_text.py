from numpy import take
import pandas as pd
import scrape_8k_text
import json
from textblob import TextBlob

companies = pd.read_csv("./csv/GoodCom.csv")

ciks = companies["CIK"].astype(int).tolist() #Get the list of all ciks


json_file_name = "8k_text_data.json" #name of json file obtained from bulk scraping

years = [2022, 2021]

def mustHave(sentence):
    return (('0' in sentence) or ('1' in sentence) or ('2' in sentence) or
           ('3' in sentence) or ('4' in sentence) or ('5' in sentence) or
           ('6' in sentence) or ('7' in sentence) or ('8' in sentence) or 
           ('9' in sentence))

data_8k_text = dict()

for cik in ciks:
    year_dict = dict()
    
    for year in years:
        try:
            sentences = scrape_8k_text.get_scrape_text(cik, "8-K", f"{year-1}0101", f"{year}0101")
            chosen = []
            taken = []
            for sentence_object in sentences:
                sentence = sentence_object['sentence']
                if sentence.lower() in taken:
                    continue
                taken.append(sentence.lower())
                result = TextBlob(sentence).sentiment 
                subjectivity = result.subjectivity #We find the subjectivity of the sentnce
                if subjectivity>=0.4 and mustHave(sentence): #If the subjectivity of the sentence is above a certain threshold, we append it to the list of final sentences
                    sentence = sentence.capitalize()
                    chosen.append({'sentence':sentence,'date':sentence_object['date']})
            
            year_dict[f"{year-1}" + " Sentences"] = chosen
        except Exception as e:
            print(e)
            continue
    print("cik ",cik," completed")
    data_8k_text[cik] = year_dict

with open(f"json/{json_file_name}", 'w') as f:
    json.dump(data_8k_text, f, indent=4)
