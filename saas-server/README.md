# SEC FILING ANALYZER FOR SAAS COMPANIES

> This codebase houses the server(backend) of our High Prep Problem Statement: DIGITAL ALPHA'S SEC FILING ANALYZER FOR SAAS COMPANIES, as part of the Inter IIT Tech Meet 2022.
> Live demo [_here_](https://saasbackendiiti.herokuapp.com/graphql).

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [License](#license)

## General Information

- This repository serves as the backend of our submission to Inter IIT Tech Meet 2022's High Prep Problem Statement: DIGITAL ALPHA'S SEC FILING ANALYZER FOR SAAS COMPANIES.

- SaaS companies are customer-driven and are heavily dependent on their customer base. There
  are a set of metrics that can showcase the health of the SaaS companies and their aspects. These
  metrics and numbers are not readily available on publicly reported SEC Filings and need to be
  chalked out from the available forms (10-K, 10-Q, 8-K, etc.).

- Accessing these metrics can be of tremendous value to the users looking to invest. However, the forms filed in SEC are very detailed, diverse and take time to analyze. Thus, we propose an interactive dashboard capable of analyzing SEC Filings to the SaaS companies and investors alike to quickly overview the Key SaaS Goals and data to make an informed decision.

## Technologies Used

- NestJS - v8.1.1
- GraphQL - v16.3.0
- Firebase (database)

## Setup

- ### Installation

  Clone this repository locally and run:

  ` $ npm install`

  to install all the dependencies.

- ### Starting the server

  To run the server in development:

  ` $ npm run start`

  To run the server in development in watch mode:

  ` $ npm run start:dev`

  To run the server in production mode:

  ` $ npm run start:prod`

## Usage

Kindly go through the documentation, which can be found at `/doc/index.html`, to get a complete understanding of the allowed queries and schema objects. Here are few possible (and useful) queries that one might want to make:

- Get the CIK of all the companies

```
    query {
        getAllCompanies{
            id
        }
    }
```

- Get the names of all the companies

```
    query {
        getAllCompanies{
            CompanyName
        }
    }
```

- Get meta data of company with given CIK

```
    query {
        getCompanyByCIK(cik: "<insert CIK>"){
            CompanyName
            Address
            FaxNumber
            HoldingType
            PhoneNumber
            URL
            exchange
            ...
        }
    }
```

- Get data obtained from 10K filings of the company with given CIK, for the past 3 years (2019, 2020, 2021)

```
    query {
        getCompanyByCIK(cik: "<insert CIK>"){
            _10k{
                DocURL
                FilingDate
                FilingForDate
                features{
                    CashAndCashEquivalents
                    GrossProfit
                    ....
                }
                sec_filing{
                    name
                    url
                }
            }
        }
    }
```

Similary, you can obtain data from 10Q and 8K filings of the companies as well.

## License

MIT License

Copyright (c) 2022 Web-Team-IITI-Gymkhana
