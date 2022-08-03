import React from 'react';
import { MATRICS } from '../../constants';
import { chartDataGenerator } from '../../utils/ChartDataGenerator';
import SyncedChart from '../base/molecules/Charts/SyncedChart';

const RatioLayout = ({ names, label, formData, title }) => {
  const matrics = MATRICS[label];
  const chartType = names.length > 1 ? 'bar' : 'area';
  const matricsData = formData.map((fd) => chartDataGenerator(label, fd));
  const DefaultComponent = () => {
    const makeRatioId = `id${label}${label}`;
    return (
      <div className="flex flex-col">
        {matrics.dependency.map((dep, index) => {
          const chartsData = formData.map((fd) => chartDataGenerator(dep, fd));
          const makeId = `id${label}${dep}`;
          return (
            <div
              key={index}
              className="w-11/12 "
              style={{ height: 'var(--chart-h)' }}
            >
              <SyncedChart
                names={names}
                data={chartsData}
                label={dep}
                id={makeId}
                group={label}
                type={chartType}
                width="var(--chart-w)"
                height="var(--chart-h)"
              />
            </div>
          );
        })}
        <div className="w-11/12" style={{ height: 'var(--chart-h)' }}>
          <SyncedChart
            names={names}
            id={makeRatioId}
            data={matricsData}
            label={label}
            group={label}
            type={chartType}
            width="var(--chart-w)"
            height="var(--chart-h)"
          />
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col h-full w-11/12 bg-saas-main ml-2 rounded-xl drop-shadow-sm p-6 hover:drop-shadow-xl">
      <div className="w-full grow">
        <DefaultComponent />
      </div>
    </div>
  );
};

export default RatioLayout;
