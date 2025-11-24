import { useState } from "react";
import { useParams, Link } from "react-router";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

import StudyHeader from "@/components/StudySession/StudyHeader";
import StudyCard from "@/components/StudySession/StudyCard";
import StudyControls from "@/components/StudySession/StudyControls";
import StudySummary from "@/components/StudySession/StudySummary";
import { useGetSessionDetails } from "@/hooks/useFlashcardQuery";
import { useSubmitAttempt } from "@/hooks/useFlashcardMutation";

function StudySessionContent() {
	const { deckId, sessionId } = useParams();
	const {
		data: session,
		isPending,
		isError,
		error,
	} = useGetSessionDetails(sessionId);
	const { mutateAsync: submitAnswer } = useSubmitAttempt();

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFinished, setIsFinished] = useState(false);

	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
				<div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 border border-red-100">
					<AlertCircle className="w-10 h-10 text-red-500" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-3">
					Không thể tải phiên học
				</h2>
				<p className="text-gray-500 mb-8 max-w-md">
					{error?.message ||
						"Phiên học không tồn tại hoặc bạn không có quyền truy cập."}
				</p>
				<Link
					to={`/decks/${deckId}`}
					className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
					<ArrowLeft className="w-5 h-5" />
					Quay lại bộ thẻ
				</Link>
			</div>
		);
	}

	const cards = session.deck.cards || [];
	const currentCard = cards[currentIndex];

	const handleRate = async (isCorrect) => {
		await submitAnswer({
			sessionId,
			payload: { cardId: currentCard.id, isCorrect },
		});

		if (currentIndex < cards.length - 1) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			setIsFinished(true);
		}
	};

	if (isFinished) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
				<StudySummary sessionId={sessionId} deckId={deckId} />
			</div>
		);
	}

	return (
		<div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
			<StudyHeader
				title={session.deck.title}
				current={currentIndex}
				total={cards.length}
				deckId={deckId}
			/>

			<div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 pb-32">
				<div className="w-full max-w-3xl h-[60vh]">
					<StudyCard key={currentCard.id} card={currentCard} />
				</div>
			</div>

			<StudyControls onRate={handleRate} />
		</div>
	);
}

export default function StudySessionPage() {
	const { sessionId } = useParams();
	return <StudySessionContent key={sessionId} />;
}
