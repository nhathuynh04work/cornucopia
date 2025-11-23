import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import CardItem from "./CardItem";

function CardList({ cards = [] }) {
	const [sortOption, setSortOption] = useState("original");

	if (!cards || cards.length === 0) return null;

	const sortedCards = [...cards].sort((a, b) => {
		if (sortOption === "alphabetical") {
			return a.term.localeCompare(b.term);
		}
		return (a.id || 0) - (b.id || 0);
	});

	return (
		<div className="mt-8">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-xl font-bold text-gray-900">
					Thuật ngữ trong bộ này ({cards.length})
				</h3>

				<div className="relative inline-block">
					<div className="flex items-center gap-2">
						<select
							value={sortOption}
							onChange={(e) => setSortOption(e.target.value)}
							className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:border-purple-200 transition-colors">
							<option value="original">Thứ tự gốc</option>
							<option value="alphabetical">
								Thứ tự bảng chữ cái
							</option>
						</select>
						<ArrowUpDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
					</div>
				</div>
			</div>

			<div className="space-y-4">
				{sortedCards.map((card) => (
					<CardItem
						key={card.id || `temp-${Math.random()}`}
						card={card}
					/>
				))}
			</div>
		</div>
	);
}

export default CardList;
