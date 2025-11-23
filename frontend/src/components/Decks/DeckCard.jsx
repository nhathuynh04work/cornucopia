import { Link } from "react-router-dom";
import { Layers } from "lucide-react";
import Avatar from "@/components/Avatar";

function DeckCard({ deck }) {
	const { id, title, user, _count } = deck;
	const cardCount = _count?.cards || 0;

	return (
		<Link
			to={`/decks/${id}`}
			className="group bg-white rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 p-5 h-full flex flex-col">
			<div className="flex items-start justify-between mb-4">
				<div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
					<Layers className="w-6 h-6" />
				</div>
			</div>

			<h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2 flex-1 group-hover:text-purple-600 transition-colors">
				{title}
			</h3>

			<div className="flex items-center gap-2 mb-4">
				<span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600">
					{cardCount} thuật ngữ
				</span>
			</div>

			{/* Footer */}
			<div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-auto">
				<Avatar url={user?.avatarUrl} name={user?.name} size="xs" />
				<span className="text-xs font-medium text-gray-500 truncate max-w-[150px]">
					{user?.name}
				</span>
			</div>
		</Link>
	);
}

export default DeckCard;
