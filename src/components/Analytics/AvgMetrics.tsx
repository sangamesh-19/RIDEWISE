import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface DonutChartProps {
  data: number[];
  labels: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data, labels }) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef && chartRef.current && chartRef.current.chartInstance) {
      const chartInstance = chartRef.current.chartInstance;
      chartInstance.destroy(); // Ensure previous chart instance is destroyed
    }

    // Function to generate random colors
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    // Generate random colors for each dataset
    const backgroundColors = data.map(() => getRandomColor());
    const hoverBackgroundColors = backgroundColors.map(color => color); // Example hover colors (same as background)

    // Create new chart instance
    if (chartRef && chartRef.current) {
      const newChartInstance = new Chart(chartRef.current.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColors,
              hoverBackgroundColor: hoverBackgroundColors,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            datalabels: {
              color: '#fff',
              anchor: 'end',
              align: 'start',
              offset: -10,
              borderWidth: 2,
              borderColor: '#fff',
              borderRadius: 25,
              backgroundColor: (context) => {
                return context.dataset.backgroundColor;
              },
              font: {
                weight: 'bold',
                size: 10,
              },
              formatter: (value, context) => {
                return `${context.chart.data.labels[context.dataIndex]}: ${value.toFixed(2)}`;
              },
            },
          },
        },
        plugins: [ChartDataLabels], // Add the datalabels plugin here
      });

      // Store the new chart instance in ref
      chartRef.current.chartInstance = newChartInstance;
    }
  }, [data, labels]);

  return <canvas ref={chartRef} />;
};

export default DonutChart;
