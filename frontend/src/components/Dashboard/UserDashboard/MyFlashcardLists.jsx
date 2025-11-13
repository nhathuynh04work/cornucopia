import React from "react";
import FlashcardListCard from "./FlashcardListCard";

const scrollbarClasses =
	"scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-purple-300 scrollbar-track-transparent scrollbar-thumb-rounded-full";

export default function MyFlashcardLists({ lists = [] }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				My Flashcard Lists
			</h2>
			<button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg text-md mb-4">
				+ Create New List
			</button>
			<div
				className={`space-y-3 max-h-64 overflow-y-auto p-1 pr-2 ${scrollbarClasses}`}>
				{lists.length > 0 ? (
					lists.map((list) => (
						<FlashcardListCard key={list.id} list={list} />
					))
				) : (
					<p className="text-gray-500 text-sm p-2">
						You haven't created any flashcard lists yet.
					</p>
				)}
			</div>
		</section>
	);
}
