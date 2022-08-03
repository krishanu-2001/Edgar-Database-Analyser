from flask import Flask, request, Response, render_template
import firebase_admin
from firebase_admin import credentials, firestore
import scrape
from scrape_utils import get_meta_stock
import json
import pandas as pd
import pickle
from put_labels_support import ratios

#########################################################################
"""
Creates Flask server and Firebase, Firestore instances
"""


app = Flask(__name__)

cred = credentials.Certificate('serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# import ml model xgboost
xgb_regressor = pickle.load(open('./ml/xgbmodel_regression.pkl','rb'))

#########################################################################
"""
It reads 8K_Text_Sentiment.json, loads it as a dictionary. 
/form route takes in the cik from the form request. Then it get_all the data 
from get_data function of scrape.py and writes into the database according
to the following structure:

company(collection)-->cik(document)-->meta_data(fields)
                                   -->_10k(sub-collection) -->FilingDocuments --> (DocURL, FilingDate, FilingForDate, features, sec_filing)
                                   -->_10q(sub-collection) -->FilingDocuments --> (DocURL, FilingDate, FilingForDate, features, sec_filing)
                                   -->_8k(sub-collection)  -->Year --> (Cluster Fields)

"""


with open('8K_Text_Sentiment.json', 'r') as f:
        data_8k = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/form', methods=['POST'])
def add_form():
    cik = request.form.get('cik')
    data = scrape.get_data(cik)
    _10k = data.pop("_10k")
    _10q = data.pop("_10q")
    meta = data
    
    db.collection("company").document(str(cik)).set(meta)

    for filing10k in _10k.keys():
        db.collection("company").document(str(cik)).collection("_10k").document(filing10k).set(_10k[filing10k])
    for filing10q in _10q.keys():
        db.collection("company").document(str(cik)).collection("_10q").document(filing10q).set(_10q[filing10q])  

    if str(cik) in data_8k.keys():
        for year in data_8k[str(cik)].keys():
            db.collection("company").document(str(cik)).collection("_8k").document(str(year)).set(data_8k[str(cik)][year])
    print(f"{cik} DONE")
    return Response(status=200)


#########################################################################
"""
/company route takes in the cik from the form request. Then it get_all the
metadata of a company from get_meta_stock function of scrape_utils.py and
writes into the database according to the following structure:

company(collection)-->cik(document)-->meta_data(fields)
"""


@app.route('/company', methods=['POST'])
def add_company():
    cik = request.form.get('cik')
    data = get_meta_stock(cik)[0]
    db.collection("company").document(cik).set(data)
    return Response(status=200)

''' machine learning '''
# Function to test if the request contains multiple 
def islist(obj):
  return True if ("list" in str(type(obj))) else False

# This function will run a saved pickle model on provided data
# post json of data: {cur: {}, prev: {}} like json/app_test.json
@app.route('/xgboost_regressor', methods=['GET', 'POST'])
def xgboost_regression():
    data = request.json
    cur = data['cur']
    prev = data['prev']
    rt = ratios()
    ratio, rato = rt.setup_ratios(cur, prev)
    print(rato)
    labels = rato
    avg_labels = labels.mean(axis = 0, skipna = True).fillna(0).to_dict()
    for key in labels.keys():
        labels[key] = labels[key].fillna(avg_labels[key])
    X = labels[['GrossProfit','GrossMargin','WorkingCapitalRatio','EarningPerShare','DebtToEquityRatio','PEratio','ReturnOfEquity','EBIDTAratio','EvRatio','EVbyEbidta','ChurnRate','GrowthRate','ProfitMargin','RuleOf40','MarketCap','MagicNumber']]
    print(X)
    xgb_predictions = model.predict(X)
    print(xgb_predictions)
    return str(xgb_predictions)


#########################################################################
if __name__ == '__main__':
    app.run(host="localhost", port=8000)