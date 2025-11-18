import { createList } from "@/apis/listApi";
import FlashcardsListCard from "@/components/Flashcards/FlashcardsListCard";
import { useNavigate } from "react-router";

export default function MyFlashcardLists({ lists = [] }) {
	const navigate = useNavigate();

	async function handleClick() {
		const list = await createList();
		navigate(`/flashcards/${list.id}/edit`);
	}
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				My Flashcard Lists
			</h2>
			<button
				onClick={handleClick}
				className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg text-md mb-4">
				+ Create New List
			</button>
			<div className={`space-y-3 max-h-64 p-1 pr-2 scroll-container`}>
				{lists.length > 0 ? (
					lists.map((list) => (
						<FlashcardsListCard key={list.id} list={list} />
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
