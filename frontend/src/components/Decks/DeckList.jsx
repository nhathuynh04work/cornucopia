import DeckCard from "./DeckCard";
import { Layers } from "lucide-react";

function DeckList({ decks }) {
	if (!decks || decks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
					<Layers className="w-10 h-10" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 mb-1">
					Chưa có bộ thẻ nào
				</h3>
				<p className="text-gray-500 max-w-sm">
					Hiện tại chưa có bộ thẻ công khai nào. Hãy thử tạo một bộ
					mới nhé!
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{decks.map((deck) => (
				<DeckCard key={deck.id} deck={deck} />
			))}
		</div>
	);
}

export default DeckList;
