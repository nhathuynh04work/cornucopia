import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import Avatar from "../Avatar";
import { useAuth } from "@/contexts/AuthContext";

export default function FlashcardsListCard({ deck }) {
	const { user } = useAuth();
	const isOwner = deck.user.id === user?.id;

	return (
		<Link
			to={`/flashcards/${deck.id}`}
			className="h-32 group relative block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-purple-500 p-4">
			{/* Info */}
			<div className="flex flex-col justify-between h-full">
				<h2
					className="mb-6 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors"
					title={deck.title || "Bộ thẻ chưa đặt tên"}>
					{deck.title || "Bộ thẻ chưa đặt tên"}
				</h2>

				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-1 mt-1">
						<Avatar url={deck.user.avatarUrl} size="xs" />
						<span className="text-gray-500 text-xs truncate">
							{!isOwner ? deck.user.name : "me"}
						</span>
					</div>

					<div className="flex items-center gap-1 text-gray-500 text-xs">
						<ClipboardList className="w-3.5 h-3.5" />
						<span>{deck._count?.flashcards || 0} thẻ</span>
					</div>
				</div>
			</div>

			{/* Accent bar */}
			<div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-100 rounded-b-xl group-hover:bg-purple-400 transition-colors"></div>
		</Link>
	);
}
