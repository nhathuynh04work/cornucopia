import React from "react";
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

export default function EnrollmentChart({ chartData }) {
	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: "New Enrollments (Last 30 Days)",
				font: { size: 14 },
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: { display: true, text: "New Users" },
				ticks: {
					// Ensure only whole numbers
					stepSize: 1,
				},
			},
		},
	};

	const data = {
		labels: chartData.labels,
		datasets: [
			{
				label: "New Enrollments",
				data: chartData.data,
				borderColor: "rgb(147, 51, 234)", // purple-600
				backgroundColor: "rgba(147, 51, 234, 0.5)",
			},
		],
	};

	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Enrollment Activity
			</h2>
			<div className="bg-white p-4 rounded-xl border border-gray-200">
				<Line options={options} data={data} />
			</div>
		</section>
	);
}
