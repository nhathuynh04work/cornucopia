import React from "react";
import Logo from "@/components/Logo";
import DonutChart from "./DonutChart"; // Assumes DonutChart is in the same folder

function LearnHeader({ courseName }) {
	// Placeholder for progress logic
	const progress = 35;

	return (
		<header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
			<div className="flex items-center gap-4">
				<Logo />
				<div className="w-px h-6 bg-gray-300" />
				<h1 className="text-md font-extralight text-gray-600 truncate">
					{courseName}
				</h1>
			</div>
			<div className="flex items-center gap-3">
				<span className="text-sm text-gray-600">
					{progress}% complete
				</span>
				<DonutChart progress={progress} size={32} strokeWidth={4} />
			</div>
		</header>
	);
}

export default LearnHeader;
