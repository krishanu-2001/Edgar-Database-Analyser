# Saas Client
SEC Filing Analyzer for Saas Companies
> Live demo [_here_](https://www.example.com)

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Usage](#usage)
* [Screenshots](#screenshots)

## General Information
- This repository serves as the frontend of our submission to Inter IIT Tech Meet 2022's High Prep Problem Statement: DIGITAL ALPHA'S SEC FILING ANALYZER FOR SAAS COMPANIES.

## Technologies Used
- React
- Apollo Client with GraphQL
- Tailwind CSS
- ReChart
- AntD

## Features
- Easy Navigation for SEC filings
  - Breakdown into seperate sections of 10-K and 10-Q forms
  - Corresponding links attached
- Highly Interactive Drilldown menu
  - Capable of zooming and pannig across time range
- Various financial ratios' calculation and display
- Overall score prediction using Machine Learning on the basis of financial ratios
- Detailed Summary of 8-K forms using NLP for sentiment analysis
- 1v1 Comparison of Companies
- Downloadable data in different formats

## Screenshots
![Example screenshot](./img/screenshot.png)
<!-- If you have screenshots you'd like to share, include them here. -->

## Setup
`Node` is a required dependency.
```bash
# to install dependencies
$ npm install
```

## Usage
```bash
# to start server
$ npm run dev # for development mode
$ npm run prod # for production mode
```
