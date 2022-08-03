import pandas as pd
import re
   
def findCik():
    companyCIK = dict()
    companyNames = pd.read_csv('Software Company List v2.csv')
    names = companyNames['Company'].tolist()
    for name in names:
        pattern = name
        pattern = pattern.strip()
        fhand = open('cik-lookup-data.txt') #We scrape the cik-lookup-data.txt document in order to obtain 
                                            #the cik ids corressponding to the company names provided in the list
        for line in fhand:
            target = line.strip()

            target = target.replace(',','') 

            hit = re.findall('^{}'.format(pattern),target) #Check if company name exists in the line
            
            if len(hit) == 0:
                continue
            else:
                cik = re.findall(':(000.*):',target) #If company name found, we extract the cik id using this regular expression
                companyCIK[pattern] = companyCIK.get(pattern,cik[0])
        fhand.close()
    
    result = pd.DataFrame(list(companyCIK.items()), columns=['CompanyName', 'CIK'])
    result.to_csv('Result_No_Repeat.csv',index=False)
            
    print("Done")


findCik()