### SEC Edgar database analyser
This is a combined archive which houses all the submodules of project. <br>

<img width="247" alt="image" src="https://user-images.githubusercontent.com/56930593/186934249-7ed03a93-1c86-4f01-962b-594871248a14.png"> 


![version](https://img.shields.io/badge/version-3.4.1-blue)
![license](https://img.shields.io/github/license/krishanu-2001/Edgar-Database-Analyser)
![contributors](https://img.shields.io/badge/contributors-10-brightgreen)
![stars](https://img.shields.io/badge/stars-3-blue)
![fork](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)

### UPDATE (Mar 2022)

**v3.0**: Develop multi-compare and charts.

**v3.1**: Predict investability score (95% similarity with Zachs rank). 

**v2.1**: Decided to use regression boosting (XGboost) for predicting company score.

**v2.0**: Decided to use GraphQl for backend services to limit endpoints.

### UPDATE (Feb 2022)

**v1.2**: Develop web scraping tool for Extracting and transforming data.

**v1.2**: Use firebase NoSQL to store the model data.

**v1.1**: Decided on financial metrics to use. EBIDTA, ROI, Magic number, Customer Acquision Cost ...

**v1.0**: Build user interface on React and viteJs.

---

## Architecture

<img width="677" alt="image" src="https://user-images.githubusercontent.com/56930593/186957748-75615d1e-00d3-4077-b313-06fa42cf8422.png">

## Investability score
<img width="535" alt="image" src="https://user-images.githubusercontent.com/56930593/186960971-c3b86187-ef10-4b41-87e8-e7df7eb3f057.png">

In a overview of the investability score prediction  

<img width="643" alt="image" src="https://user-images.githubusercontent.com/56930593/186961186-3c0e8ac2-bfbe-48bf-b3be-9f6e8c2b50dc.png">


## Libraries/Code sources

Except for the ReChart and Tailwind CSS library for frontend most functionality is written in Vanilla-Js. Python toolkit is created using beautiful soup and sklearn library. 

Some icon images have been sourced from Font Awesome 5. The license is at [this link](https://fontawesome.com/license/free). No changes (except scaling) were made to these images.

## References
Links to original repositories are  

1. https://github.com/Web-Team-IITI-Gymkhana/data-bot 
2. https://github.com/Web-Team-IITI-Gymkhana/saas-client
3. https://github.com/Web-Team-IITI-Gymkhana/saas-server

## Technical details

Each submodule has its own defined technology specification as a README.md file.

## Contribute

First of all, thanks for your contribution! Every small bit of it counts! You can:

1.  [Create a new issue](https://github.com/krishanu-2001/Edgar-Database-Analyser/issues/new) for bugs, feature requests, and enhancements.
3.  Fork the repo, make changes, and submit a pull request, describing the changes made.
4.  We would love to get to know more financial metrics and optimization techniques to explore.   
5.  Finally, utilize the Filing analyser for understanding the SAAS market and curating your portfolio!
6.  Do star the repo if you like it!

## Development

To setup the user interface repo, clone it, `cd` into it, and then run `npm install`. To start the server `npm run dev`.  
To setup the data-scraping repo. Create a firebase account. Clone the repo, `cd` into it, and then run `webscrape.py`. 

**Contact us** - krishanu21saini@gmail.com - to discuss anything related to the above if you want to.
