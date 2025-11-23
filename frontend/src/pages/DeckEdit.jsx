import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useGetDeckDetails } from "@/hooks/useFlashcardQuery";
import DeckEditor from "@/components/DeckEditor/DeckEditor";
import Footer from "@/layouts/Footer";

function DeckEdit() {
	const { deckId } = useParams();
	const { data: deck, isPending, isError, error } = useGetDeckDetails(deckId);

	// --- Loading State ---
	if (isPending) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
				<Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
			</div>
		);
	}

	// --- Error State ---
	if (isError) {
		return (
			<div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-6 bg-white">
				<div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 border border-red-100">
					<AlertCircle className="w-10 h-10 text-red-500" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-3">
					Không tải được bộ thẻ
				</h2>
				<p className="text-gray-500 mb-8 max-w-md">
					{error?.message || "Có lỗi xảy ra khi tải dữ liệu."}
				</p>
				<Link
					to="/decks"
					className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
					<ArrowLeft className="w-5 h-5" />
					Quay lại thư viện
				</Link>
			</div>
		);
	}

	// --- Main Editor Layout ---
	return (
		<div className="fixed inset-0 z-50 bg-white overflow-y-auto">
			<DeckEditor deck={deck} />

			<Footer />
		</div>
	);
}

export default DeckEdit;
