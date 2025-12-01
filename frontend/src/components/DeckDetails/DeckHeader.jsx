import { Play, Share2, Globe, BarChart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStartSession } from "@/hooks/useFlashcardMutation";
import { useNavigate } from "react-router";
import EditMenu from "./EditMenu";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/common";

function DeckHeader({ deck }) {
	const { user } = useAuth();
	const isOwner = user?.id === deck.userId;
	const { mutate: startSession, isPending } = useStartSession();
	const navigate = useNavigate();

	const handleStartSession = () => {
		startSession(
			{ deckId: deck.id },
			{
				onSuccess: (session) => {
					navigate(`/decks/${deck.id}/study/${session.id}`);
				},
			}
		);
	};

	// Helper to get labels
	const getLabel = (options, value) =>
		options.find((o) => o.value === value)?.label || value;

	const levelLabel = getLabel(LEVEL_OPTIONS, deck.level);
	const langLabel = getLabel(LANGUAGE_OPTIONS, deck.language);

	return (
		<div className="mb-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-4 break-words">
				{deck.title}
			</h1>

			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				{/* Statistics / Status */}
				<div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500">
					<span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-700">
						{deck.cards.length} thuật ngữ
					</span>

					{/* Standardized Badges */}
					<div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full text-blue-700 text-xs font-bold border border-blue-100">
						<BarChart className="w-3 h-3" />
						{levelLabel}
					</div>

					<div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-full text-indigo-700 text-xs font-bold border border-indigo-100">
						<Globe className="w-3 h-3" />
						{langLabel}
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<button
						onClick={handleStartSession}
						disabled={isPending}
						className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 text-sm">
						<Play className="w-4 h-4 fill-current" />
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
