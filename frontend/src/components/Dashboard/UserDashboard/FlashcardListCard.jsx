import React from "react";

export default function FlashcardListCard({ list }) {
	// Add navigation logic here
	const handleStudy = () => {
		console.log(`Studying list ${list.id}`);
		// e.g., router.push(`/flashcards/${list.id}/study`)
	};

	return (
		<div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between text-sm">
			<span className="text-gray-700 truncate" title={list.name}>
				{list.name} ({list.cards})
			</span>
			<button
				onClick={handleStudy}
				className="text-purple-600 hover:text-purple-700 font-medium ml-2 flex-shrink-0">
				Study <span className="ml-1">▶</span>
			</button>
		</div>
	);
}
