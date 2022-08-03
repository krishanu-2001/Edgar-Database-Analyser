import React, { useContext } from 'react';
import InfoLayout from '../layouts/InfoLayout';
import Context from '../../context/context-config';

const Info = (props) => {
  const myContext = useContext(Context);
  const curCompany = myContext.selectedCompanies[0];
  if (!curCompany) {
    return <div>No Company Selected</div>;
  }
  console.log(curCompany);
  const meta_data = {
    Address: curCompany['Address'],
    CompanyName: curCompany['CompanyName'],
    FaxNumber: curCompany['FaxNumber'],
    HoldingType: curCompany['HoldingType'],
    IPODate: curCompany['IPODate'],
    PhoneNumber: curCompany['PhoneNumber'],
    URL: curCompany['URL'],
    Ticker: curCompany['ticker'],
    Exchange: curCompany['exchange']
  };

  return <InfoLayout data={meta_data} scores={curCompany.score} />;
};

export default Info;
