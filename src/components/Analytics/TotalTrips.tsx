import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Trip {
    count: number;
    service_name: string;
}

interface TotalTripsProps {
    trips: Trip[];
}

const TotalTrips: React.FC<TotalTripsProps> = ({ trips }) => {
    if (!trips || trips.length === 0) {
        return <div>No data available</div>; // Handle case where data is empty or undefined
    }
    console.log(trips)
    // Define colors for each service (add more colors as needed)
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#3CB371'];

    const data = {
        labels: trips.map(trip => trip.service_name),
        datasets: [
            {
                data: trips.map(trip => trip.count),
                backgroundColor: colors.slice(0, trips.length), // Use colors for each dataset
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                label: 'Total Trips', // Optional label for the dataset
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide the legend (color indicator)
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0, // Show whole numbers only
                },
                grid: {
                    display: false, // Hide y-axis grid lines
                },
            },
            x: {
                grid: {
                    display: false, // Hide x-axis grid lines
                },
            },
        },
    };

    return (
        <div>
            <h2>Total Trips per Service</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default TotalTrips;
