import { useGetDeckDetails } from "@/hooks/useFlashcardQuery";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import DeckHeader from "@/components/DeckDetails/DeckHeader";
import DeckCarousel from "@/components/DeckDetails/DeckCarousel";
import CardList from "@/components/DeckDetails/CardList";
import DeckOwnerInfo from "@/components/DeckDetails/DeckOwnerInfo";

function DeckDetails() {
	const { deckId } = useParams();
	const { data: deck, isPending, isError, error } = useGetDeckDetails(deckId);

	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50/30">
				<Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
				<div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 border border-red-100">
					<AlertCircle className="w-10 h-10 text-red-500" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-3">
					Không tìm thấy bộ thẻ
				</h2>
				<p className="text-gray-500 mb-8 max-w-md leading-relaxed">
					{error?.message ||
						"Bộ thẻ bạn đang tìm kiếm có thể đã bị xóa hoặc được đặt ở chế độ riêng tư."}
				</p>
				<Link
					to="/decks"
					className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all">
					<ArrowLeft className="w-5 h-5" />
					Quay lại thư viện
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/30 pb-20">
			<main className="max-w-5xl mx-auto px-6 py-8">
				{/* 1. Header Info */}
				<DeckHeader deck={deck} />

				{/* 2. Main Study Carousel */}
				<DeckCarousel key={deck.id} cards={deck.cards} />

				{/* 3. User Info Bar */}
				<DeckOwnerInfo owner={deck.user} />

				{/* 4. List of Terms */}
				<CardList cards={deck.cards} />
			</main>
		</div>
	);
}

export default DeckDetails;
