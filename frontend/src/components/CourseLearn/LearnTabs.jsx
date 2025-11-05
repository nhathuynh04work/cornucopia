import React from "react";

function LearnTabs({ activeTab, setActiveTab, description }) {
	// Helper for tab styling
	const getTabClass = (tabName) => {
		const base = "py-4 px-4 text-sm font-medium border-b-2 -mb-px";
		if (activeTab === tabName) {
			return `${base} font-bold text-gray-900 border-gray-900`;
		}
		return `${base} text-gray-600 hover:text-gray-900 border-transparent`;
	};

	return (
		<div className="bg-white shadow-sm">
			{/* Tab Bar */}
			<div className="flex border-b border-gray-200 px-6 md:px-10">
				<button
					onClick={() => setActiveTab("overview")}
					className={getTabClass("overview")}>
					Overview
				</button>
				<button
					onClick={() => setActiveTab("comments")}
					className={getTabClass("comments")}>
					Comments
				</button>
				{/* Placeholder Tabs */}
				<button
					disabled
					className={`${getTabClass(
						"qa"
					)} text-gray-400 cursor-not-allowed`}>
					Q&A
				</button>
				<button
					disabled
					className={`${getTabClass(
						"notes"
					)} text-gray-400 cursor-not-allowed`}>
					Notes
				</button>
				<button
					disabled
					className={`${getTabClass(
						"announcements"
					)} text-gray-400 cursor-not-allowed`}>
					Announcements
				</button>
			</div>

			{/* Tab Content */}
			<div className="p-6 md:p-10">
				{activeTab === "comments" && (
					<div>
						<h3 className="text-xl font-semibold mb-4">
							Lesson Comments
						</h3>
						<p className="text-gray-600">
							Comments section coming soon!
						</p>
					</div>
				)}
				{activeTab === "overview" && (
					<div>
						<h3 className="text-xl font-semibold mb-4">
							About This Course
						</h3>
						<p className="text-gray-700 leading-relaxed">
							{description ||
								"No detailed course description provided."}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default LearnTabs;
