const FEATURES = {
    NetIncome: { id: 'NetIncome' },
    CashAndCashEquivalents: { id: 'CashAndCashEquivalents' },
    Revenues: { id: 'Revenues' },
    SalesAndMarketing: { id: 'SalesAndMarketing' },
    SharesOutstanding: { id: 'SharesOutstanding' },
    StockPrice: { id: 'StockPrice' },
    TotalAssets: { id: 'TotalAssets' },
    TotalCurrentAssets: { id: 'TotalCurrentAssets' },
    TotalCurrentLiabilities: { id: 'TotalCurrentLiabilities' },
    TotalEquity: { id: 'TotalEquity' },
    TotalOperatingExpenses: { id: 'TotalOperatingExpenses' },
    TotalStockholdersEquity: { id: 'TotalStockholdersEquity' },
    MarketableSecurities: { id: 'MarketableSecurities' },
    GrossProfit: { id: 'GrossProfit' },
    CostOfSales: { id: 'CostOfSales' },
    GAAPRevenue: { id: 'GAAPRevenue' },
    Goodwill: { id: 'Goodwill' },
    GrossPropertyAndEquipment: { id: 'GrossPropertyAndEquipment' },
    TotalDebt: { id: 'TotalDebt' },
    OperatingIncome: { id: 'OperatingIncome' },
    PropertyAndEquipmentNet: { id: 'PropertyAndEquipmentNet' },
    RecurringRevenue: { id: 'RecurringRevenue' },
    NetLoss: { id: 'NetLoss' },
    NonGAAPEarnings: { id: 'NonGAAPEarnings' },
    MRR: { id: 'MRR' },
    ARR: { id: 'ARR' }
}
const MATRICS = {
    GrossProfit: {
        id: 'GrossProfit',
        dependency: [FEATURES.Revenues.id, FEATURES.CostOfSales.id]
    },
    ProfitMargin: {
        id: 'ProfitMargin',
        dependency: [FEATURES.NetIncome.id]
    },
    DebtToEquityRatio: { id: 'DebtToEquityRatio', dependency: [FEATURES.TotalCurrentLiabilities.id, FEATURES.TotalStockholdersEquity.id] },
    EarningPerShareRatio: { id: 'EarningPerShareRatio', dependency: [FEATURES.NetIncome.id, FEATURES.SharesOutstanding.id] },
    WorkingCapitalRatio: {
        id: 'WorkingCapitalRatio', dependency: [FEATURES.TotalCurrentAssets.id, FEATURES.TotalCurrentLiabilities.id]
    },
    ReturnOnEquity: {
        id: 'ReturnOnEquity', dependency: [FEATURES.NetIncome.id, FEATURES.TotalStockholdersEquity.id]
    },
    PERatio: { id: 'PERatio', dependency: [FEATURES.StockPrice.id, 'EarningPerShareRatio'] },
    MarketCap: { id: 'MarketCap', dependency: [FEATURES.SharesOutstanding.id, FEATURES.StockPrice.id] },
    GrossMargin: { id: 'GrossMargin', dependency: [FEATURES.Revenues.id, FEATURES.CostOfSales.id] },
    Rule40: { id: 'Rule40', dependency: ['GrowthRate', 'ProfitMargin'] },
    EBIDTA: {
        id: 'EBIDTA',
        dependency: [FEATURES.Revenues.id, FEATURES.CostOfSales.id, FEATURES.TotalOperatingExpenses.id]
    },
    GrowthRate: {
        id: 'GrowthRate',
        dependency: ['EBIDTA']
    },
    MagicNumber: { id: 'MagicNumber', dependency: ['EBIDTA', FEATURES.CostOfSales.id] },
    EV: { id: 'EV', dependency: ['MarketCap', FEATURES.TotalStockholdersEquity.id, FEATURES.TotalDebt.id, FEATURES.CashAndCashEquivalents.id] },
}
const NOT_DEFINED = 'NaN'
export { FEATURES, MATRICS, NOT_DEFINED }