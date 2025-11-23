import DeckList from "@/components/Decks/DeckCard";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import DashboardSection from "../DashboardSection";
import { useCreateDeck } from "@/hooks/useFlashcardMutation";

export default function MyFlashcardLists({ lists = [] }) {
	const { mutate, isPending } = useCreateDeck();
	const navigate = useNavigate();

	function handleClick() {
		mutate(
			{},
			{
				onSuccess: (deck) => {
					navigate(`/flashcards/${deck.id}/edit`);
				},
			}
		);
	}

	return (
		<DashboardSection title="My Flashcard Decks">
			<button
				onClick={handleClick}
				disabled={isPending}
				className={`group w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium mb-4 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 ${
					isPending
						? "opacity-75 cursor-not-allowed"
						: "hover:-translate-y-0.5"
				}`}>
				<div className="bg-purple-500 p-1 rounded-lg group-hover:bg-purple-600 transition-colors">
					<Plus className="w-4 h-4" />
				</div>
				{isPending ? "Creating..." : "Create New Deck"}
			</button>

			<div className="space-y-3 max-h-64 p-1 pr-2 scroll-container">
				{lists.length > 0 ? (
					lists.map((list) => (
						<DeckList key={list.id} list={list} />
					))
				) : (
					<p className="text-gray-500 text-sm p-2 text-center italic">
						You haven't created any flashcard lists yet.
					</p>
				)}
			</div>
		</DashboardSection>
	);
}
