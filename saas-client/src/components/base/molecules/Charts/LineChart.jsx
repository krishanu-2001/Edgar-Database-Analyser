import React from 'react';
import {
  ComposedChart as Chart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function LineChart(props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Line type="monotone" dataKey={props.label} stroke="var(--primary)" />
      </Chart>
    </ResponsiveContainer>
  );
}

export default LineChart;
