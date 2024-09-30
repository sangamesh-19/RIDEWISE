import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Rating {
    service_name: string;
    avg_rating: number;
}

interface AverageRatingsProps {
    ratings: Rating[];
}

const AverageRatings: React.FC<AverageRatingsProps> = ({ ratings }) => {
    if (!ratings || ratings.length === 0) {
        return <div>No data available</div>; // Handle case where data is empty or undefined
    }

    // Define colors for each service (add more colors as needed)
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#3CB371'];

    const data = {
        labels: ratings.map(rating => rating.service_name),
        datasets: [
            {
                data: ratings.map(rating => rating.avg_rating.toFixed(2)), // Format average rating to 2 decimal places
                backgroundColor: colors.slice(0, ratings.length), // Use colors for each dataset
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                label: 'Average Rating', // Optional label for the dataset
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
                    precision: 1,
                },
                grid: {
                    display: false, // Hide y-axis grid lines
                },
            },
            x:{
                grid: {
                    display: false, // Hide y-axis grid lines
                },
            }
        },
    };

    return (
        <div>
            <h2>Average Ratings per Service</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default AverageRatings;
