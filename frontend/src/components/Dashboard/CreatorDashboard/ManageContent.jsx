import { useState } from "react";
import CreatorContentItem from "./CreatorContentItem";
import Tabs from "../Tabs";

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

			{/* Reusable Tabs Component */}
			<Tabs
				tabs={tabs}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{/* Content Lists */}
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
