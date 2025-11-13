import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export default function PlatformRevenueChart({ data: chartData }) {
	const options = {
		responsive: true,
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: "Platform Revenue (Last 6 Months)",
				font: { size: 14 },
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				// Data is now in dollars, not cents
				ticks: { callback: (value) => `$${value / 1000}k` },
			},
		},
	};

	const data = {
		labels: chartData.labels,
		datasets: [
			{
				label: "Revenue",
				data: chartData.data,
				backgroundColor: "rgba(168, 85, 247, 0.7)", // purple-500
			},
		],
	};
	return <Bar options={options} data={data} />;
}
