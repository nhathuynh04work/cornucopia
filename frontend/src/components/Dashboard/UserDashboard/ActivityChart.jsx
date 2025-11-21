import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import DashboardSection from "../DashboardSection";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ActivityChart({ attempts = [] }) {
	const processed = attempts.map((attempt) => ({
		score: (attempt.scoredPoints / attempt.totalPossiblePoints) * 100,
	}));

	const passing = processed.filter((a) => a.score >= 80).length;
	const improving = processed.filter(
		(a) => a.score >= 50 && a.score < 80
	).length;
	const needsReview = processed.filter((a) => a.score < 50).length;

	const data = {
		labels: [
			"Passing (80% +)",
			"Improving (50-79%)",
			"Needs Review (< 50%)",
		],
		datasets: [
			{
				label: "Test Attempts",
				data: [passing, improving, needsReview],
				backgroundColor: [
					"rgba(147, 51, 234, 0.7)", // purple-600
					"rgba(168, 85, 247, 0.7)", // purple-500
					"rgba(209, 213, 219, 0.7)", // gray-300
				],
				borderColor: [
					"rgba(124, 58, 237, 1)", // purple-700
					"rgba(147, 51, 234, 1)", // purple-600
					"rgba(156, 163, 175, 1)", // gray-400
				],
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					font: {
						size: 12,
					},
				},
			},
			title: {
				display: true,
				text: "Test Performance Breakdown",
				font: {
					size: 14,
				},
			},
		},
	};

	return (
		<DashboardSection title="Your Activity">
			<div className="bg-white p-4 rounded-xl border border-gray-200">
				<Doughnut data={data} options={options} />
			</div>
		</DashboardSection>
	);
}
