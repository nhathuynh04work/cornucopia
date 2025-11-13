import React from "react";

export default function AttemptHistoryCard({ attempt }) {
	// Format the date string/object from the server
	const formattedDate = new Date(attempt.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	return (
		<div className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
			<p className="font-semibold text-gray-800 truncate">
				{attempt.testName}
			</p>
			<p className="text-gray-600 text-xs">Score: {attempt.score}%</p>
			<p className="text-gray-500 text-xs">{formattedDate}</p>
		</div>
	);
}
