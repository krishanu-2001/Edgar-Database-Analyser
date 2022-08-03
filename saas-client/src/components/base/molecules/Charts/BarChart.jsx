import React from 'react';
import {
  BarChart as Chart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip
} from 'recharts';
function BarChart(props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={props.label} fill="var(--primary)" />
      </Chart>
    </ResponsiveContainer>
  );
}

export default BarChart;
