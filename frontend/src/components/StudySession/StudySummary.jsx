import { useStartSession } from "@/hooks/useFlashcardMutation";
import { Link, useNavigate } from "react-router";
import { Loader2, RefreshCcw, ArrowLeft, Trophy } from "lucide-react";
import { useGetSessionSummary } from "@/hooks/useFlashcardQuery";
import toast from "react-hot-toast";

function StudySummary({ sessionId, deckId }) {
	const navigate = useNavigate();
	const { data: summary, isPending } = useGetSessionSummary(sessionId);
	const { mutate: restart, isPending: isRestarting } = useStartSession();

	const handleRestart = () => {
		restart(
			{ deckId },
			{
				onSuccess: (session) => {
					navigate(`/flashcards/${deckId}/study/${session.id}`);
				},
				onError: () => {
					toast.error("Không thể học lại. Thử lại sau!");
				},
			}
		);
	};

	if (isPending) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
				<p className="text-gray-500 font-medium">
					Đang tổng hợp kết quả...
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-xl mx-auto w-full bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
			{/* Header - Clean White with Icon */}
			<div className="bg-white p-8 text-center border-b border-gray-50">
				<div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
					<Trophy className="w-8 h-8 text-purple-500" />
				</div>
				<h2 className="text-3xl font-bold text-gray-900 mb-2">
					Hoàn thành!
				</h2>
				<p className="text-gray-500 font-medium">{summary.deckTitle}</p>
			</div>

			{/* Stats Grid */}
			<div className="p-8">
				<div className="grid grid-cols-3 gap-4 mb-8">
					<div className="p-4 bg-green-50 rounded-2xl text-center border border-green-100">
						<div className="text-2xl font-bold text-green-600">
							{summary.correctCount}
						</div>
						<div className="text-xs font-bold text-green-500 uppercase mt-1">
							Đã thuộc
						</div>
					</div>
					<div className="p-4 bg-red-50 rounded-2xl text-center border border-red-100">
						<div className="text-2xl font-bold text-red-500">
							{summary.incorrectCount}
						</div>
						<div className="text-xs font-bold text-red-500 uppercase mt-1">
							Cần ôn lại
						</div>
					</div>
					{/* Accuracy - Softer Purple */}
					<div className="p-4 bg-purple-50 rounded-2xl text-center border border-purple-100">
						<div className="text-2xl font-bold text-purple-600">
							{summary.accuracy}%
						</div>
						<div className="text-xs font-bold text-purple-500 uppercase mt-1">
							Chính xác
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="space-y-3">
					<button
						onClick={handleRestart}
						disabled={isRestarting}
						className="flex items-center justify-center gap-2 w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg shadow-purple-100 disabled:opacity-70">
						{isRestarting ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							<RefreshCcw className="w-5 h-5" />
						)}
						Học lại
					</button>
					<Link
						to={`/flashcards/${deckId}`}
						className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all">
						<ArrowLeft className="w-5 h-5" />
						Về trang bộ thẻ
					</Link>
				</div>
			</div>
		</div>
	);
}

export default StudySummary;
