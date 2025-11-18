import CourseCard from "@/components/Courses/CourseCard";
import FlashcardsListCard from "@/components/Flashcards/FlashcardsListCard";
import TestCard from "@/components/Tests/TestCard";
import { useState } from "react";
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
							} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Tab Panels */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1 pr-2">
				{currentData?.length > 0 ? (
					currentData.map((item) => {
						if (activeTab === "courses") {
							return <CourseCard key={item.id} course={item} />;
						}

						// Render Test Card
						if (activeTab === "tests") {
							return <TestCard key={item.id} test={item} />;
						}

						// Render Flashcards Card
						if (activeTab === "flashcards") {
							return (
								<FlashcardsListCard key={item.id} list={item} />
							);
						}

						// Render Blog Posts (Fallback to DiscoveryCard)
						if (activeTab === "blogPosts") {
							// Adapter: Post data usually has 'author.name', but DiscoveryCard expects 'creator'
							const postAdapter = {
								...item,
								creator: item.author?.name || item.creator,
							};
							return (
								<DiscoveryCard
									key={item.id}
									item={postAdapter}
									type="blog"
								/>
							);
						}

						return null;
					})
				) : (
					<p className="text-gray-500 col-span-1 lg:col-span-2 py-4 text-center italic">
						Nothing new to discover right now.
					</p>
				)}
			</div>
		</section>
	);
}
