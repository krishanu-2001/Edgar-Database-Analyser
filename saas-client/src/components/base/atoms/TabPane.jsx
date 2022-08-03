import * as React from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

function TabPaneComponent(props) {
  const { children, value, key, ...other } = props;
  console.log(children);
  return (
    <TabPane
      {...other}
      tab={<div className="text-saasselected">{value}</div>}
      key={key}
    >
      {children}
    </TabPane>
  );
}
function TabsComponent(props) {
  const { children, onChange, defaultKey, ...other } = props;
  return (
    <Tabs {...other} onChange={onChange} defaultActiveKey={defaultKey}>
      {children}
    </Tabs>
  );
}
export { TabPaneComponent, TabsComponent };
