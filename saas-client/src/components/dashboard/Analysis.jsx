import React, { useContext } from 'react';
import { Tabs } from 'antd';
import RatioLayout from '@/components/layouts/RatioLayout';
import { generateMatricsData } from '../../utils/MatrixDataGenerator';
import { MATRICS } from '../../constants';
import { isInsufficientData } from '../../utils/utils';
import Context from '../../context/context-config';

const { TabPane } = Tabs;
// const Company = dummy[Object.keys(dummy)[0]];

const Analysis = () => {
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
  const formDataK = Companies.map((company) =>
    generateMatricsData(company._10k)
  );
  const formDataQ = Companies.map((company) =>
    generateMatricsData(company._10q)
  );
  return (
    <Tabs className="text-saasdisabled h-full" defaultActiveKey="1">
      {Object.keys(MATRICS).map((id, index) => {
        if (isInsufficientData(formDataQ[0], 'matrics', id)) {
          if (isInsufficientData(formDataK[0], 'matrics', id)) {
            return null;
          }
          return (
            <TabPane
              className="h-full hover:text-saasselected"
              tab={id}
              key={index + 1}
            >
              <RatioLayout
                names={companiesName}
                label={id}
                formData={formDataK}
                title={id}
              />
            </TabPane>
          );
        }
        return (
          <TabPane
            className="h-full hover:text-saasselected"
            tab={id}
            key={index + 1}
          >
            <RatioLayout
              names={companiesName}
              label={id}
              formData={formDataQ}
              title={id}
            />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default Analysis;
