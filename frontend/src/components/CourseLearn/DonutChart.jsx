import React from "react";

// This component renders the SVG-based chart
function DonutChart({ progress, size = 32, strokeWidth = 4 }) {
	const center = size / 2;
	const radius = center - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			className="-rotate-90">
			{/* Background track */}
			<circle
				className="stroke-gray-200"
				cx={center}
				cy={center}
				r={radius}
				strokeWidth={strokeWidth}
				fill="transparent"
			/>
			{/* Progress arc */}
			<circle
				className="stroke-purple-600 transition-all duration-300"
				cx={center}
				cy={center}
				r={radius}
				strokeWidth={strokeWidth}
				fill="transparent"
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
			/>
		</svg>
	);
}

export default DonutChart;
