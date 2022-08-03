import React from 'react';
import Chart from 'react-apexcharts';
import millify from 'millify';

function SyncedChart({ names, data, label, group, id, type, width, height }) {
  const categories = data[0].map((d) => d.name);
  const valuesArray = data.map((company) => {
    return company.map((d) => d[label]);
  });
  console.log(valuesArray);
  const options = {
    chart: {
      id: id,
      group: group,
      height: height,
      width: width
    },
    title: {
      text: label,
      align: 'left',
      floating: true
    },
    stroke: {
      curve: 'smooth',
      width: 1.5
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      show: false
    },
    xaxis: {
      categories: categories
    },
    yaxis: {
      labels: {
        minWidth: width,
        formatter: (value) => {
          return millify(value, {
            units: ['', 'K', 'M', 'B', 'T', 'P'],
            space: true,
            precision: 3
          });
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      x: { show: false },
      shared: true,
      intersect: false
    }
  };
  const series = valuesArray.map((values, index) => {
    return {
      name: names[index],
      data: values
    };
  });
  return (
    <Chart
      options={options}
      series={series}
      type={type}
      width="100%"
      height="100%"
    />
  );
}

export default SyncedChart;
