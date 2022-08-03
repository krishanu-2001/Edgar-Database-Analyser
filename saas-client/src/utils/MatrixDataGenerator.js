import { MATRICS, NOT_DEFINED } from "../constants"
import { isNotDefined } from "./utils"

function getEBIDTA(features) {
    if (isNotDefined([features.Revenues, features.TotalOperatingExpenses])) {
        return NOT_DEFINED
    }
    return (features.Revenues - features.TotalOperatingExpenses)
}
function getGrossMargin(features) {
    if (isNotDefined([features.Revenues, features.CostOfSales])) {
        return NOT_DEFINED
    }
    return ((features.Revenues - features.CostOfSales) / features.Revenues)
}
function getGrossProfit(features) {
    if (isNotDefined([features.Revenues, features.CostOfSales])) {
        return NOT_DEFINED
    }
    return (features.Revenues - features.CostOfSales)
}
function getMagicNumber(features, previous) {
    if (isNotDefined([getEBIDTA(features), previous.CostOfSales])) {
        return NOT_DEFINED
    }
    return (getEBIDTA(features) / previous.CostOfSales)
}
function getMarketCap(features) {
    if (isNotDefined([features.SharesOutstanding, features.StockPrice])) {
        return NOT_DEFINED
    }
    return (features.SharesOutstanding * features.StockPrice)
}
function getEV(features) {
    if (isNotDefined([getMarketCap(features), features.TotalStockholdersEquity, features.TotalDebt, features.CashAndCashEquivalents])) {
        return NOT_DEFINED
    }
    return (getMarketCap(features) + features.TotalStockholdersEquity + features.TotalDebt - features.CashAndCashEquivalents)
}
function getGrowthRate(features, previous) {
    if (previous === NOT_DEFINED) {
        return 0;
    }
    if (isNotDefined([getEBIDTA(features), getEBIDTA(previous)])) {
        return NOT_DEFINED
    }
    return (((getEBIDTA(features) - getEBIDTA(previous)) / getEBIDTA(previous)) * 100)
}
function getProfitMargin(features, previous) {
    if (previous === NOT_DEFINED) {
        return 0;
    }
    if (isNotDefined([features.NetIncome, previous.NetIncome])) {
        return NOT_DEFINED
    }
    return (((features.NetIncome - previous.NetIncome) / previous.NetIncome) * 100)
}
function getRule40(features, previous) {
    if (isNotDefined([getGrowthRate(features, previous), getProfitMargin(features, previous)])) {
        return NOT_DEFINED
    }
    return (getGrowthRate(features, previous) + getProfitMargin(features, previous))
}

function getReturnOnEquity(features) {
    if (isNotDefined([features.NetIncome, features.TotalStockholdersEquity])) {
        return NOT_DEFINED
    }
    return ((features.NetIncome / features.TotalStockholdersEquity) * 100)
}

function getWorkingCapitalRatio(features) {
    if (isNotDefined([features.TotalCurrentAssets, features.TotalCurrentLiabilities])) {
        return NOT_DEFINED
    }
    return (features.TotalCurrentAssets / features.TotalCurrentLiabilities)
}
function getEarningPerShareRatio(features) {
    if (isNotDefined([features.NetIncome, features.SharesOutstanding])) {
        return NOT_DEFINED
    }
    return (features.NetIncome / features.SharesOutstanding)
}
function getPERatio(features) {
    if (isNotDefined([features.StockPrice, getEarningPerShareRatio(features)])) {
        return NOT_DEFINED
    }
    return (features.StockPrice / getEarningPerShareRatio(features))
}
function getDebtToEquityRatio(features) {
    if (isNotDefined([features.TotalCurrentLiabilities, features.TotalStockholdersEquity])) {
        return NOT_DEFINED
    }
    return (features.TotalCurrentLiabilities / features.TotalStockholdersEquity)
}

function calculateMetricsPerFilling(features, previous) {
    return {
        [MATRICS.WorkingCapitalRatio.id]: getWorkingCapitalRatio(features),
        [MATRICS.DebtToEquityRatio.id]: getDebtToEquityRatio(features),
        [MATRICS.EBIDTA.id]: getEBIDTA(features),
        [MATRICS.EarningPerShareRatio.id]: getEarningPerShareRatio(features),
        [MATRICS.GrossMargin.id]: getGrossMargin(features),
        [MATRICS.GrossProfit.id]: getGrossProfit(features),
        [MATRICS.MagicNumber.id]: getMagicNumber(features, previous),
        [MATRICS.MarketCap.id]: getMarketCap(features),
        [MATRICS.PERatio.id]: getPERatio(features),
        [MATRICS.ReturnOnEquity.id]: getReturnOnEquity(features),
        [MATRICS.Rule40.id]: getRule40(features, previous),
        [MATRICS.EV.id]: getEV(features),
        [MATRICS.GrowthRate.id]: getGrowthRate(features, previous),
        [MATRICS.ProfitMargin.id]: getProfitMargin(features, previous)
    }
}
function generateMatricsData(form) {
    if (!form || form.length === 0) {
        return []
    }
    const updatedForm = []
    form.forEach((year, index) => {
        const matrics = calculateMetricsPerFilling(year.features, (form[index - 1] ? form[index - 1].features : NOT_DEFINED))
        updatedForm.push({ ...year, matrics: matrics })
    })
    return updatedForm
}
export { generateMatricsData }