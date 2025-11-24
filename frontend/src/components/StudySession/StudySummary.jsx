import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGetSessionSummary } from "@/hooks/useFlashcardQuery";
import { useStartSession } from "@/hooks/useFlashcardMutation";
import StudySummaryChart from "./StudySummaryChart";
import StudySummaryLists from "./StudySummaryLists";
import StudySummaryActions from "./StudySummaryActions";

function StudySummary({ sessionId, deckId }) {
	const navigate = useNavigate();
	const { data: summary, isPending } = useGetSessionSummary(sessionId);
	const { mutate: restart, isPending: isRestarting } = useStartSession();

	const handleRestart = () => {
		restart(
			{ deckId },
			{
				onSuccess: (session) => {
					navigate(`/decks/${deckId}/study/${session.id}`);
				},
				onError: () => {
					toast.error("Không thể học lại. Thử lại sau!");
				},
			}
		);
	};

	if (isPending) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-gray-500">
				<Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
				<p className="font-medium">Đang tổng hợp kết quả...</p>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto w-full bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden my-4 flex flex-col md:flex-row h-full md:h-auto max-h-[90vh]">
			{/* Left Panel: Chart & Meta */}
			<div className="flex flex-col md:w-1/3">
				<StudySummaryChart
					accuracy={summary.accuracy}
					duration={summary.durationSeconds}
					totalCards={summary.totalCards}
				/>

				{/* Actions (Desktop Position - inside left panel for balance) */}
				<div className="hidden md:block p-8 bg-gray-50 border-r border-gray-100 flex-1">
					<StudySummaryActions
						onRestart={handleRestart}
						isRestarting={isRestarting}
						deckId={deckId}
					/>
				</div>
			</div>

			{/* Right Panel: Detailed Lists */}
			<div className="w-full md:w-2/3 p-8 bg-white flex flex-col">
				<h3 className="text-lg font-bold text-gray-900 mb-6">
					Chi tiết các thẻ
				</h3>

				<div className="flex-1 overflow-hidden">
					<StudySummaryLists
						reviewCards={summary.reviewCards}
						masteredCards={summary.masteredCards}
						incorrectCount={summary.incorrectCount}
						correctCount={summary.correctCount}
					/>
				</div>

				{/* Actions (Mobile Position) */}
				<div className="md:hidden mt-6 pt-6 border-t border-gray-100">
					<StudySummaryActions
						onRestart={handleRestart}
						isRestarting={isRestarting}
						deckId={deckId}
					/>
				</div>
			</div>
		</div>
	);
}

export default StudySummary;
