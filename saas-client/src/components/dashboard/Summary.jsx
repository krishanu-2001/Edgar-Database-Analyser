import React, { useContext } from 'react';
import Context from '../../context/context-config';
import SummaryLayout from '../layouts/SummaryLayout';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Summary = () => {
  const myContext = useContext(Context);
  const Companies = myContext.selectedCompanies;

  if (!Companies[0]) {
    return <div>No Company Selected</div>;
  }
  if (!Companies[0]._8k || Companies[0]._8k.length === 0) {
    return <div>No Data Available</div>;
  }
  //   const summaryList = Company._8k;
  const formData8K = Companies[0]._8k;
  // const summaryList = transform_8k_idk_if_this_is_temporary(formData8K);
  return (
    <Tabs className="text-saasdisabled h-full" defaultActiveKey="1">
      {formData8K.map((summaryList, index) => {
        return (
          <TabPane
            className="h-full hover:text-saasselected"
            tab={summaryList.id}
            key={index + 1}
          >
            <SummaryLayout summaryList={summaryList} />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default Summary;
