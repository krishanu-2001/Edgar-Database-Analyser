import React from 'react';
import { chartDataGenerator } from '../../utils/ChartDataGenerator';
import SyncedChart from '../base/molecules/Charts/SyncedChart';

const ChartLayout = ({ names, label, formData }) => {
  const chartsData = formData.map((fd) => chartDataGenerator(label, fd));
  const DefaultComponent = () => {
    const id = `id${label}ind`;
    return (
      <div className="flex flex-col">
        <div
          style={{ width: 'var(--chart-w)', height: 'var(--chart-h-lg)' }}
          className="p-3"
        >
          <SyncedChart
            names={names}
            data={chartsData}
            label={label}
            id={id}
            type={'bar'}
            width="var(--chart-w)"
            height="var(--chart-h-lg)"
          />
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-row h-full w-full ml-2 p-6">
      <div className="flex flex-col h-full w-9/12 bg-saas-main ml-2 rounded-xl drop-shadow-sm p-6 hover:drop-shadow-xl">
        <div className="w-full grow pt-10">
          <DefaultComponent />
        </div>
      </div>
    </div>
  );
};

export default ChartLayout;
