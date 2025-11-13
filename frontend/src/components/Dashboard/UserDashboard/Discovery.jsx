import React, { useState } from "react";
import DiscoveryCard from "./DiscoveryCard";

export default function Discovery({ discoverData }) {
	const [activeTab, setActiveTab] = useState("courses");
	const { courses, tests, blogPosts, flashcards } = discoverData || {};

	const tabs = [
		{ key: "courses", label: "Courses", data: courses },
		{ key: "tests", label: "Tests", data: tests },
		{ key: "blogPosts", label: "Blog Posts", data: blogPosts },
		{ key: "flashcards", label: "Flashcards", data: flashcards },
	];

	const currentData = tabs.find((t) => t.key === activeTab)?.data;

	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Discover What's New
			</h2>
			{/* Tabs */}
			<div className="border-b border-gray-200 mb-4">
				<nav className="-mb-px flex space-x-8" aria-label="Tabs">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`${
								activeTab === tab.key
									? "border-purple-500 text-purple-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize`}>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Tab Panels */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1 pr-2">
				{currentData?.length > 0 ? (
					currentData.map((item) => (
						<DiscoveryCard
							key={`${activeTab}-${item.id}`}
							item={item}
							type={activeTab} // e.g., 'courses', 'tests'
						/>
					))
				) : (
					<p className="text-gray-500 col-span-3">
						Nothing new to discover right now.
					</p>
				)}
			</div>
		</section>
	);
}
