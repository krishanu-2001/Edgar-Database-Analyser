import data from '../../demo.json'
export class DataFormatter {
    constructor(companyId) {
        this.companyId = companyId
    }
    getCompanyMetaData() {
        return {
            Address: data[this.companyId]['Address'],
            CompanyName: data[this.companyId]['CompanyName'],
            FaxNumber: data[this.companyId]['FaxNumber'],
            HoldingType: data[this.companyId]['HoldingType'],
            IPODate: data[this.companyId]['IPODate'],
            PhoneNumber: data[this.companyId]['PhoneNumber'],
            URL: data[this.companyId]['URL'],
            Ticker: data[this.companyId]['Ticker'],
            Exchange: data[this.companyId]['Exchange']
        }
    }
    getAllFeatures() {
        return Object.keys(Object.values(data[this.companyId]['_10k'])[0].features)
    }
    getAllSECFillings() {
        return Object.keys(Object.values(data[this.companyId]['_10k'])[0].sec_filing)
    }
    getQuarterlyFeatureData(featureName) {
        const list = []
        const quarters = Object.keys(data[this.companyId]['_10q'])
        const featureDetails = Object.values(data[this.companyId]['_10q']).map(quarters => {
            if (isNaN(quarters.features[featureName])) {
                return null
            }
            return quarters.features[featureName]
        })

        // console.log(years)
        // console.log(featureDetails)

        if (featureDetails.every(val => val !== null)) {
            quarters.forEach((quarter, idx) => list.push({ quarter, [featureName]: featureDetails[idx] }))
        }

        return list
    }

    getYearlyFeatureData(featureName) {
        const list = []
        const years = Object.keys(data[this.companyId]['_10k'])
        const featureDetails = Object.values(data[this.companyId]['_10q']).map(years => {
            if (isNaN(years.features[featureName])) {
                return null
            }
            return years.features[featureName]
        })

        if (featureDetails.every(val => val !== null)) {
            years.forEach((year, idx) => list.push({ year, [featureName]: featureDetails[idx] }))
        }
        return list
    }
}