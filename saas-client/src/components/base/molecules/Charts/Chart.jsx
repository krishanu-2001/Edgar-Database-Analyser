import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceArea
} from 'recharts';

import Checkbox from '@/components/base/atoms/Checkbox';

import obj from '../../../../../demo.json';
import { DataFormatter } from '@/utils/DataFormatter';

console.log(obj);

const df = new DataFormatter('1459417'); // initialise constructor with company id
// console.log(df.getQuarterlyFeatureData('CashAndCashEquivalents'));
// console.log(df.getYearlyFeatureData('CashAndCashEquivalents'));
console.log(df.getCompanyMetaData());
const allFeatures = df.getAllFeatures();
// const data = df.getQuarterlyFeatureData('CashAndCashEquivalents');
// const data = df.getYearlyFeatureData(allFeatures[3]);
// console.log(df.getYearlyFeatureData(allFeatures[3]));
const getAxisYDomain = (from, to, ref, offset) => {
  // console.log(from, to);
  const refFrom = data.findIndex((x) => x.name === from);
  const refTo = data.findIndex((x) => x.name === to);
  // console.log(refFrom + 1, refTo + 1);
  const refData = data.slice(refFrom + 1 - 1, refTo + 1);
  // console.log(refData);
  let [bottom, top] = [refData[0][ref], refData[0][ref]];
  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });
  return [(bottom | 0) - offset, (top | 0) + offset];
};
function Chart({ title }) {
  const [initialState, setInitialState] = useState({
    data: [],
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    top: 'dataMax+1',
    bottom: 'dataMin-1',
    top2: 'dataMax+20',
    bottom2: 'dataMin-20',
    animation: true
  });

  const [isYearlyChartSelected, setIsYearlyChartSelected] = useState(true);
  const [isQuarterlyChartSelected, setIsQuarterlyChartSelected] =
    useState(false);

  const zoom = () => {
    let { refAreaLeft, refAreaRight, data } = initialState;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setInitialState((prevState) => ({
        ...prevState,
        refAreaLeft: '',
        refAreaRight: ''
      }));
      return;
    }
    // xAxis domain
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    // yAxis domain
    const [bottom, top] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      Object.keys(data[0])[1],
      1
    );
    setInitialState((prevState) => ({
      ...prevState,
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top
    }));
  };
  const zoomOut = () => {
    const { data } = initialState;
    setInitialState((prevState) => ({
      ...prevState,
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+1',
      bottom: 'dataMin'
    }));
  };

  const handleYearlyQuarterlyFilter = (e) => {
    setIsYearlyChartSelected(!isYearlyChartSelected);
    setIsQuarterlyChartSelected(!isQuarterlyChartSelected);
  };

  useEffect(() => {
    let data;
    if (isQuarterlyChartSelected) {
      data = df.getQuarterlyFeatureData(title);
    } else {
      data = df.getYearlyFeatureData(title);
    }

    setInitialState({ ...initialState, data: data });
  }, [isQuarterlyChartSelected, isYearlyChartSelected]);

  if (initialState.data.length === 0) {
    return <h2>Data Unavailable</h2>;
  }

  return (
    <div className="highlight-bar-charts" style={{ userSelect: 'none' }}>
      <button type="button" className="btn update" onClick={() => zoomOut()}>
        Zoom Out
      </button>
      <br />
      <div className="flex justify-center mb-2">
        <Checkbox
          id="yearly_check"
          label="YEARLY"
          value="yearly"
          checked={isYearlyChartSelected}
          onChange={handleYearlyQuarterlyFilter}
        />
        <Checkbox
          id="quarterly_check"
          label="QUARTERLY"
          value="quarterly"
          checked={isQuarterlyChartSelected}
          onChange={handleYearlyQuarterlyFilter}
        />
      </div>
      <hr />

      <ResponsiveContainer
        width="w-80%"
        height="h-60%"
        minWidth={500}
        minHeight={300}
      >
        <AreaChart
          data={initialState.data}
          margin={{
            top: 20,
            right: 70,
            left: 70,
            bottom: 20
          }}
          onMouseDown={(e) =>
            setInitialState({ ...initialState, refAreaLeft: e.activeLabel })
          }
          onMouseMove={(e) =>
            initialState.refAreaLeft &&
            setInitialState({ ...initialState, refAreaRight: e.activeLabel })
          }
          // eslint-disable-next-line react/jsx-no-bind
          onMouseUp={() => zoom()}
        >
          <CartesianGrid
            vertical="true"
            horizontal="true"
            strokeDasharray="5 5"
          />
          <XAxis
            dataKey={
              initialState.data[0] && Object.keys(initialState.data[0])[0]
            }
            axisLine={{ stroke: '#151517', strokeWidth: 1 }}
            tick={{
              stroke: '#151517',
              fontSize: 'small',
              strokeWidth: 0.5
            }}
            allowDataOverflow
            domain={[initialState.left, initialState.right]}
          />
          <YAxis
            axisLine={{ stroke: '#151517', strokeWidth: 1 }}
            // allowDataOverflow
            tick={{
              stroke: '#151517',
              fontSize: 'small',
              strokeWidth: 0.5
            }}
            domain={[initialState.bottom, initialState.top]}
          />
          <Tooltip isAnimationActive={true} />
          <Area
            type="natural"
            dataKey={
              initialState.data[0] && Object.keys(initialState.data[0])[1]
            }
            activeDot={true}
            isAnimationActive={true}
            animationEasing="ease-in-out"
            stroke="#00A2FF"
            fill="#7B9FFA"
            animationDuration={300}
          />
          {initialState.refAreaLeft && initialState.refAreaRight ? (
            <ReferenceArea
              x1={initialState.refAreaLeft}
              x2={initialState.refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export default Chart;
