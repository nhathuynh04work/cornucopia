import { useState } from "react";
import CreatorContentItem from "./CreatorContentItem";

export default function ManageContent({ content }) {
	const [activeTab, setActiveTab] = useState("courses");
	const { courses, tests, blogPosts, flashcards } = content;

	const tabs = [
		{ key: "courses", label: "Courses", data: courses, type: "course" },
		{ key: "tests", label: "Tests", data: tests, type: "test" },
		{
			key: "blogPosts",
			label: "Blog Posts",
			data: blogPosts,
			type: "blog",
		},
		{
			key: "flashcards",
			label: "Flashcards",
			data: flashcards,
			type: "flashcard",
		},
	];

	const currentData = tabs.find((t) => t.key === activeTab);

	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Manage Your Content
			</h2>
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

			{/* Content Lists - No max-h or scrolling */}
			<div className="space-y-3 p-1 pr-2">
				{currentData?.data?.length > 0 ? (
					currentData.data.map((item) => (
						<CreatorContentItem
							key={item.id}
							item={item}
							type={currentData.type}
						/>
					))
				) : (
					<p className="text-gray-500">
						You haven't created any{" "}
						{currentData?.label.toLowerCase()} yet.
					</p>
				)}
			</div>
		</section>
	);
}
