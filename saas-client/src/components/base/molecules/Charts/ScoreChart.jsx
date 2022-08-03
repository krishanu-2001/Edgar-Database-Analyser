import React from 'react';
import Chart from 'react-apexcharts';

function ScoreChart({ data, label, width }) {
  var options = {
    chart: {
      height: 200
    },

    series: [data],
    colors: ['#20E647'],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '60%',
          background: '#293450'
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: '#fff',
            fontSize: '12px'
          },
          value: {
            offsetY: -3,
            color: '#fff',
            fontSize: '24px',
            show: true
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: ['#87D4F9'],
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: [label]
  };

  return (
    <Chart
      options={options}
      series={[data]}
      type="radialBar"
      width={width}
      height="100%"
    />
  );
}

export default ScoreChart;
