import { Loader2, RefreshCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function StudySummaryActions({
	onRestart,
	isRestarting,
	deckId,
	className = "",
}) {
	return (
		<div className={`space-y-3 ${className}`}>
			<button
				onClick={onRestart}
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
				to={`/decks/${deckId}`}
				className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all">
				<ArrowLeft className="w-5 h-5" />
				Về trang bộ thẻ
			</Link>
		</div>
	);
}

export default StudySummaryActions;
