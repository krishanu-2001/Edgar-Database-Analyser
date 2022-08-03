import pandas as pd
from asyncio.windows_events import NULL
from cmath import nan
from cmath import isnan
import json
import numpy as np
 
f = open('bulk_test.json')

data = json.load(f)
  #Below functions are designed to generate labels or categories, 
# Profitability ratios and metrics on the basis of investability.
#Ideal Ranges of each ratios and metrics are considered on the basis of theoretical or 
# technical and market perspective generally used by investors.
# You can take a look at the below functions of Financial Ratios / Metrics and
#  their Respective Ideal Range.
# labels generated in form of 0 or 1 or Nan: where 
      # 0 denotes bad Metrics or Ratio value for investment
      # 1 denotes good ratio value for investment
      # Nan denotes data insufficiency where data is not publicly-
        # -released by company in their SEC filings/

##Functions
#1. Working Capital ratios  1.5=<r<=2
def wce(r):  
    if isnan(r)== True:
        return float('nan') 
    elif r>=1.5 and r<=2:
        return 1
    else: 
        return 0  
"================================================"
#2. Debt to Equity ratios  0.5=<r<=1.5
def de(r):
  if isnan(r)== True:
    return float('nan')    
  elif r>=0.5 and r<=1.5:
    return 1
  else: 
    return 0 
"================================================"
#3. Earning per Share  1=<r<=99
def eps(r):
    if isnan(r)== True:
        return float('nan')  
    elif r>=1 and r<=99:
        return 1
    else: 
        return 0 
"================================================"
#4. price-earning ratio::P/E ratio: r>13
def pe(r):
    if isnan(r)== True:
        return float('nan')  
    elif r>13:
        return 1
    else: 
        return 0
"================================================"
#5. Return of Equity:r>15
def roe(r):
    if isnan(r)== True:
        return float('nan')  
    elif r>15:
        return 1
    else: 
        return 0
"================================================"
#6. Rule of 40:r>40
def ro40(r):
    if isnan(r)== True:
        return float('nan') 
    elif r>40:
        return 1
    else: 
        return 0
"================================================"
#7. Market Capitalization: r> $2Billion
def market_cap(r):
    if isnan(r)== True:
        return float('nan')  
    elif r>2000000000:
        return 1
    else: 
        return 0
"================================================"
#8. Growth Rate:r>60%
def growth_rate(r):
    if isnan(r)== True:
        return float('nan') 
    elif r>60:
        return 1
    else: 
        return 0
"================================================"
#9. Profit Margin:r>20
def profit_margin(r):
    if isnan(r)== True:
        return float('nan') 
    elif r>20:
        return 1
    else: 
        return 0
"================================================"
#10. Gross Margin:r>0.5
def gross_margin(r):
    if isnan(r)== True:
        return float('nan')  
    elif r>0.5:
        return 1
    else: 
        return 0
"================================================"
#11. Magic Number: r>1
def magic_num(r):
    if isnan(r)== True:
        return float('nan')  
    elif r>1:
        return 1
    else: 
        return 0
"================================================"
#12. Churn Rate:r<1
def chun_rate(r):
    if isnan(r)== True:
        return float('nan') 
    elif r<1:
      return 1
    else: 
      return 0

"=============================================="

'''
**Disclaimer**
>> MRR and ARR isn't publicly released by most of the companies in their SEC fillings. 
So, we are working on the assumption that most of the SaaS companies 
follow a subscription based model. 
>>Hence, our assumption to replace ARR and MRR with Net Revenues has
 grounds for standing.
---------------------------------------------------------------------------- 
Working Capital Ratio	= Total Current Assets / Total Current Liabilities 
Earning Per Share	= Profit ( or Income ) / Ang common outstanding shares 
Debt to Equity Ratio	= Total Liabilities / Total Shareholders' (or Stockholders') equity 
P / E ratio = Share Price / Earning per share 
Return of Equity	 (Net Earnings / Shareholders' (or Stockholders') Equity) x 100
EBIDTA = Revenue - Cost of Goods - Operating Costs 
Churn Rate	= (Current Subscription Revenue - Previous Subscription Revenue) / Previous Subscription Revenue  
Rule of 40 = growth rate + profit margin 	
EV = Marketcap + Total Stockholders' Equity + Total Debt - Total Cash
Market Cap	= Total Outstanding Share * Share Price
Magic Number = Net New MRR * 4 of current quarter/ Sales and Marketing of prev quarter 
Gross Profit = Revenue - Cost of Goods Sold
Gross Margin = (Revenue - Cost of Goods Sold) / Revenue 
'''
epsilon = 0.000000000000000000001

for cik in data:
  if cik == "1108524":
    for dt in data[cik]["_10k"]: 
      print(f"cik: {cik}", end=" ")
      print(f"date: {dt}", end=" \n")
      curDate = int(dt)
      prevDate = curDate - 1
      if str(prevDate) not in data[cik]["_10k"]:
        prevDate = curDate # just to prevent NaN error
    
      # Definitions
      # ============================================================================================ #
      prev = data[cik]["_10k"][str(prevDate)]['features']
      cur = data[cik]["_10k"][dt]['features']

      for keys in cur:
        try:
          cur[keys] = np.float64(cur[keys])
        except:
          try:
            if isnan(cur[keys])== True:
              cur[keys] = np.float64('nan')
          except:
            pass
      
      for keys in prev:
        try:
          prev[keys] = np.float64(prev[keys])
        except:
          try:
            if isnan(prev[keys])== True:
              prev[keys] = np.float64('nan')
          except:
            pass

      cur['ARR'] = (cur['MRR'] * 12)
      prev['ARR'] = (prev['MRR'] * 12)
      # ============================================================================================= #

      # Gross Profit = Revenue - Cost of Goods Sold
      GrossProfit = (cur['Revenues'] - cur['CostOfSales'])

      # Gross Margin = (Revenue - Cost of Goods Sold) / Revenue
      GrossMargin = (cur['Revenues'] - cur['CostOfSales']) / cur['Revenues']

      # Working capital ratio
      WorkingCapitalRatio = cur['TotalCurrentAssets'] / cur['TotalCurrentLiabilities' ] 

      # Earning Per Share
      EarningPerShare = cur['NetIncome'] / cur['SharesOutstanding']
      
      # Debt to Equity Ratio
      DebtToEquityRatio = cur['TotalCurrentLiabilities'] / cur ['TotalStockholdersEquity']

      # P / E ratio
      PEratio = cur['StockPrice'] / EarningPerShare 

      # Return of Equity
      ReturnOfEquity = (cur['NetIncome'] /  cur ['TotalStockholdersEquity']) * 100 

      # EBIDTA
      EBIDTAratio = cur['Revenues'] - cur['TotalOperatingExpenses']
      
      #Churn Rate 
      try:
        ChurnRate = cur['CustomerChurn']
      except:
          ChurnRate = (cur['NetIncome'] - prev['NetIncome']) / prev['NetIncome']
      # Growth Rate 
      if(cur['ARR'] != "NaN"): 
        GrowthRate =((cur['ARR'] - prev['ARR']) / prev['ARR']) * 100
      else:
        GrowthRate =((cur['EBITDAratio'] - prev['EBITDAratio']) / prev['EBITDAratio']) * 100

      # Profit Margin 
      ProfitMargin =((cur['NetIncome'] - prev['NetIncome']) / prev['NetIncome']) * 100 

      # Rule of 40 
      RuleOf40 = GrowthRate + ProfitMargin
      
      
      # Market Cap	= Total Outstanding Share * Share Price
      MarketCap = cur['SharesOutstanding'] * cur['StockPrice']
      
      # Magic Number = Net New MRR * 4 of current quarter/ Sales and Marketing of prev quarter
      MagicNumber = cur['ARR'] / prev['CostOfSales']

      ratios = {
        'GrossProfit':GrossProfit,
        'GrossMargin':GrossMargin,
        'WorkingCapitalRatio':WorkingCapitalRatio,
        'EarningPerShare':EarningPerShare,
        'DebtToEquityRatio':DebtToEquityRatio,
        'PEratio':PEratio, 
        'ReturnOfEquity':ReturnOfEquity,
        'EBIDTAratio': EBIDTAratio, 
        'ChurnRate':ChurnRate,
        'GrowthRate': GrowthRate, 
        'ProfitMargin':ProfitMargin,
        'RuleOf40':RuleOf40,
        'MarketCap':MarketCap,
        'MagicNumber':MagicNumber,       
      }

      rato= pd.DataFrame(ratios.items())
      rato, rato.columns= rato.T, ratios.keys()
      rato.drop(index=rato.index[0],axis=0, inplace=True)
      #print(rato)
      rato['wce_label']=rato['WorkingCapitalRatio'].apply(wce)
      rato['eps_label']=rato['EarningPerShare'].apply(eps)
      rato['de_label']=rato['DebtToEquityRatio'].apply(de)
      rato['pe_label']=rato['PEratio'].apply(pe)
      rato['roe_label']=rato['ReturnOfEquity'].apply(roe)
      rato['growth_rate_label']=rato['GrowthRate'].apply(growth_rate)
      rato['profitm_label']=rato['ProfitMargin'].apply(profit_margin)
      rato['grossm_label']=rato['GrossMargin'].apply(gross_margin)
      rato['ro40_label']=rato['RuleOf40'].apply(ro40)
      rato['churnrate_label']=rato['ChurnRate'].apply(chun_rate)
      rato['marketCap_label']=rato['MarketCap'].apply(market_cap)
      rato['magicNum_label']=rato['MagicNumber'].apply(magic_num)
      rato['Average']=rato.iloc[:,-12:].mean(axis=0,skipna=True)
      print(rato.iloc[:,-13:])
      print(ratios)
    break


f.close()
