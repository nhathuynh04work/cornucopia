import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useCreateDeck } from "@/hooks/useFlashcardMutation";

export default function CreateDeckButton() {
	const navigate = useNavigate();
	const { mutate: createDeck } = useCreateDeck();

	async function handleClick() {
		createDeck(
			{},
			{
				onSuccess: (deck) => {
					navigate(`/flashcards/${deck.id}/edit`);
				},
			}
		);
	}

	return (
		<button
			onClick={handleClick}
			title="Tạo bộ thẻ mới"
			className="group relative flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden">
			<div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"></div>

			<div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full border-2 border-current bg-white/60">
				<Plus className="w-6 h-6" />
			</div>
		</button>
	);
}
