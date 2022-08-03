import { gql } from '@apollo/client';

const query = gql`
        query getCompanyByCIK($cik: String!) {
          getCompanyByCIK(cik: $cik) {
            id
            CompanyName
            Address
            FaxNumber
            HoldingType
            PhoneNumber
            URL
            IPODate
            exchange
            ticker
            score {
              year
              score
            }
            _10k {
              id
              DocURL
              FilingDate
              FilingForDate
              features {
                ARR
                CashAndCashEquivalents
                CostOfSales
                GAAPRevenue
                Goodwill
                GrossProfit
                GrossPropertyAndEquipment
                MRR
                MarketableSecurities
                NetIncome
                NetLoss
                NonGAAPEarnings
                OperatingIncome
                PropertyAndEquipmentNet
                RecurringRevenue
                Revenues
                SalesAndMarketing
                SharesOutstanding
                StockPrice
                TotalAssets
                TotalCurrentAssets
                TotalCurrentLiabilities
                TotalDebt
                TotalEquity
                TotalOperatingExpenses
                TotalStockholdersEquity
              }
              sec_filing {
                name
                url
              }
            }
            _10q {
              id
              DocURL
              FilingDate
              FilingForDate
              features {
                ARR
                CashAndCashEquivalents
                CostOfSales
                GAAPRevenue
                Goodwill
                GrossProfit
                GrossPropertyAndEquipment
                MRR
                MarketableSecurities
                NetIncome
                NetLoss
                NonGAAPEarnings
                OperatingIncome
                PropertyAndEquipmentNet
                RecurringRevenue
                Revenues
                SalesAndMarketing
                SharesOutstanding
                StockPrice
                TotalAssets
                TotalCurrentAssets
                TotalCurrentLiabilities
                TotalDebt
                TotalEquity
                TotalOperatingExpenses
                TotalStockholdersEquity
              }
              sec_filing {
                name
                url
              }
            }
            _8k {
              id
              _0 {
                date
                sentence
                sentiment
              }
              _1 {
                date
                sentence
                sentiment
              }
              _2 {
                date
                sentence
                sentiment
              }
              _3 {
                date
                sentence
                sentiment
              }
              _4 {
                date
                sentence
                sentiment
              }

            }
          }
        }
      `;
export { query };