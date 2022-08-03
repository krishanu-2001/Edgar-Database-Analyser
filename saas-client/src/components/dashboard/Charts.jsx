import React, { useContext } from 'react';
import { Tabs } from 'antd';

import ChartLayout from '@/components/layouts/ChartLayout';

import { isInsufficientData } from '../../utils/utils';
import { FEATURES } from '../../constants';
import Context from '../../context/context-config';

const { TabPane } = Tabs;

const Home = () => {
  const myContext = useContext(Context);
  const Companies = myContext.selectedCompanies;
  if (!Companies || !Companies.length) {
    return <div>No Company Selected</div>;
  }
  if (
    !Companies[0]._10k ||
    !Companies[0]._10q ||
    Companies[0]._10k.length === 0 ||
    Companies[0]._10q.length === 0
  ) {
    return <div>No Data Available</div>;
  }
  const companiesName = Companies.map((company) => company.CompanyName);
  const formDataK = Companies.map((company) => company._10k);
  const formDataQ = Companies.map((company) => company._10q);

  return (
    <Tabs className="text-saasdisabled h-full" defaultActiveKey="1">
      {Object.keys(FEATURES).map((label, index) => {
        if (isInsufficientData(formDataQ[0], 'features', label)) {
          if (isInsufficientData(formDataK[0], 'features', label)) {
            return null;
          }
          return (
            <TabPane
              className="h-full hover:text-saasselected"
              tab={label}
              key={index + 1}
            >
              <ChartLayout
                names={companiesName}
                label={label}
                formData={formDataK}
              />
            </TabPane>
          );
        }
        return (
          <TabPane
            className="h-full hover:text-saasselected"
            tab={label}
            key={index + 1}
          >
            <ChartLayout
              names={companiesName}
              label={label}
              formData={formDataQ}
            />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default Home;
