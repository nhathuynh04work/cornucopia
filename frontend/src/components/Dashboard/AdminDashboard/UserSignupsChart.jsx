import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export default function UserSignupsChart({ data: chartData }) {
	const options = {
		responsive: true,
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: "New User Signups (Last 35 Days)",
				font: { size: 14 },
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: { stepSize: 1 }, // Ensure whole numbers
			},
		},
	};

	const data = {
		labels: chartData.labels,
		datasets: [
			{
				label: "New Users",
				data: chartData.data,
				borderColor: "rgb(147, 51, 234)", // purple-600
				backgroundColor: "rgba(147, 51, 234, 0.5)",
			},
		],
	};
	return <Line options={options} data={data} />;
}
