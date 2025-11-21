import React from "react";

export default function DiscoveryCard({ item, type }) {
	// The `item` object structure varies, so we use optional chaining
	const title = item.title || item.name;
	const { creator, tags, lessons, cards } = item;

	// Add navigation logic here
	const handleViewDetails = () => {
		console.log(`Viewing details for ${type} with id: ${item.id}`);
		// e.g., router.push(`/${type}/${item.id}`)
	};

	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 h-full flex flex-col justify-between">
			<div>
				<h3
					className="font-semibold text-gray-800 truncate"
					title={title}>
					{title}
				</h3>
				{creator && (
					<p className="text-sm text-gray-600">by {creator}</p>
				)}
				{tags && tags.length > 0 && (
					<p className="text-xs text-gray-500 mt-1 truncate">
						Tags: {tags.join(", ")}
					</p>
				)}
				{type === "courses" && lessons !== undefined && (
					<p className="text-xs text-gray-500 mt-1">
						{lessons} lessons
					</p>
				)}
				{type === "flashcards" && cards !== undefined && (
					<p className="text-xs text-gray-500 mt-1">{cards} cards</p>
				)}
			</div>
			<button
				onClick={handleViewDetails}
				className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium text-left">
				View Details
			</button>
		</div>
	);
}
