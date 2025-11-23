import { Play, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStartSession } from "@/hooks/useFlashcardMutation";
import { useNavigate } from "react-router";
import EditMenu from "./EditMenu";

function DeckHeader({ deck }) {
	const { user } = useAuth();
	const isOwner = user?.id === deck.userId;
	const { mutate: startSession, isPending } = useStartSession();
	const navigate = useNavigate();

	const handleStartSession = async () => {
		startSession(
			{ deckId: deck.id },
			{
				onSuccess: (session) => {
					navigate(`/flashcards/${deck.id}/study/${session.id}`);
				},
			}
		);
	};

	return (
		<div className="mb-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-4 break-words">
				{deck.title}
			</h1>

			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				{/* Statistics / Status */}
				<div className="flex items-center gap-4 text-sm font-medium text-gray-500">
					<span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-700">
						{deck.cards.length} thuật ngữ
					</span>
					{deck.isPublic ? (
						<span className="flex items-center gap-1.5 text-green-600">
							<span className="w-2 h-2 rounded-full bg-green-500"></span>
							Công khai
						</span>
					) : (
						<span className="flex items-center gap-1.5 text-gray-500">
							<span className="w-2 h-2 rounded-full bg-gray-400"></span>
							Riêng tư
						</span>
					)}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<button
						onClick={handleStartSession}
						disabled={isPending}
						className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-70">
						<Play className="w-5 h-5 fill-current" />
						<span>Học ngay</span>
					</button>

					<button className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-white bg-gray-100/50 rounded-xl transition-all border border-transparent hover:border-gray-200">
						<Share2 className="w-5 h-5" />
					</button>

					{isOwner && <EditMenu deck={deck} />}
				</div>
			</div>
		</div>
	);
}

export default DeckHeader;
