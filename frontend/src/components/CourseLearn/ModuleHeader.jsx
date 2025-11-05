import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function ModuleHeader({
	module,
	index,
	isOpen,
	checkedCount,
	totalLessons,
	totalTime, // This is now real data (in minutes)
	onClick,
}) {
	return (
		<button
			onClick={onClick}
			className="w-full flex justify-between items-start p-4 text-left bg-gray-100">
			<div className="flex-1 min-w-0 mr-4">
				<span className="font-semibold text-sm text-gray-800">
					Section {index + 1}: {module.title}
				</span>
				<span className="block text-xs text-gray-600 mt-1.5">
					{/* This UI now displays real data */}
					{checkedCount} / {totalLessons} | {totalTime}m
				</span>
			</div>
			{isOpen ? (
				<ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
			) : (
				<ChevronRight className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
			)}
		</button>
	);
}

export default ModuleHeader;
