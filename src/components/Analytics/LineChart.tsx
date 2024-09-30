import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data }: { data: any }) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const serviceNames = ['Ola', 'Uber', 'Rapido'];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56'];
    const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'];

    const datasets = serviceNames.map((serviceName, index) => {
        const serviceData = data
            .filter((item: { service_name: string; }) => item.service_name === serviceName)
            .reduce((acc: any[], item: { hour: string; count: any; }) => {
                const hourIndex = parseInt(item.hour.split(':')[0]);
                acc[hourIndex] = item.count;
                return acc;
            }, new Array(24).fill(0));

        return {
            label: serviceName,
            data: serviceData,
            borderColor: colors[index],
            backgroundColor: backgroundColors[index],
            fill: true, // Set this to true to enable fill
            tension: 0.4, // Create curves
        };
    });

    const chartData = {
        labels: hours,
        datasets: datasets,
    };

    const chartOptions = {
        scales: {
            x: {
                grid: {
                    display: false, // Hide x-axis grid lines
                },
            },
            y: {
                grid: {
                    display: false, // Hide y-axis grid lines
                },
                beginAtZero: true, // Ensure y-axis starts at zero
            },
        },
        elements: {
            line: {
                fill: true, // Ensure lines are filled
            },
        },
    };

    return (
        <div>
            <h2>Hourly Ride Counts by Service</h2>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default LineChart;
