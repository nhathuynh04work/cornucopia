import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/formatters";


import TestHeader from "@/components/TestAttempt/TestHeader";
import TestFooter from "@/components/TestAttempt/TestFooter";
import ReferencePanel from "@/components/TestAttempt/ReferencePanel";
import QuestionCard from "@/components/TestAttempt/QuestionCard";
import QuestionPalette from "@/components/TestAttempt/QuestionPalette";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";
import { useTestAttempt } from "@/hooks/useTestAttempt";

export default function TestAttempt() {
	const { testId } = useParams();
	const navigate = useNavigate();

	// UI-only Refs and State
	const scrollContainerRef = useRef(null);
	const isProgrammaticScroll = useRef(false);
	const [isPaletteOpen, setIsPaletteOpen] = useState(false);
	const [showExitModal, setShowExitModal] = useState(false);

	// Core Logic
	const {
		test,
		questions,
		currentQuestion,
		isPending,
		isError,
		error,
		progress,
		currentIdx,
		answersMap,
		flagged,
		setCurrentIdx,
		handleAnswer,
		toggleFlag,
		submitAttempt,
	} = useTestAttempt(testId);

	// Navigation Handlers (UI-Specific)
	const handleNavClick = useCallback(
		(index) => {
			isProgrammaticScroll.current = true;
			setCurrentIdx(index);
			setTimeout(() => {
				isProgrammaticScroll.current = false;
			}, 800);
		},
		[setCurrentIdx]
	);

	const handleVisibleQuestion = useCallback(
		(index) => {
			if (!isProgrammaticScroll.current) {
				setCurrentIdx(index);
			}
		},
		[setCurrentIdx]
	);

	if (isPending) {
		return (
			<div className="h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
				<AlertCircle className="w-12 h-12 text-red-500 mb-4" />
				<h2 className="text-xl font-bold text-gray-900">
					Unable to load test
				</h2>
				<p className="text-gray-500 mt-2">
					{error?.message || "Please try again later."}
				</p>
				<button
					onClick={() => navigate(-1)}
					className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
					Go Back
				</button>
			</div>
		);
	}

	if (!currentQuestion) return null;

	const parentGroup = currentQuestion.parent;

	// Derived view logic for rendering
	const visibleQuestions = parentGroup
		? questions.filter((q) => q.parentId === parentGroup.id)
		: [currentQuestion];

	return (
		<div className="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
			<TestHeader
				title={test.title}
				currentIdx={currentIdx}
				totalQuestions={questions.length}
				audioUrl={test.audioUrl}
				progress={progress}
				timeLimit={test.timeLimit}
				onTogglePalette={() => setIsPaletteOpen(true)}
				onSubmit={submitAttempt}
				onExit={() => setShowExitModal(true)}
			/>

			<main className="flex-1 min-h-0 w-full max-w-[1800px] mx-auto grid grid-cols-12 gap-6 p-6 overflow-hidden">
				{/* LEFT: Reference Panel */}
				{parentGroup && (
					<div className="col-span-6 flex flex-col h-full min-h-0 animate-in fade-in duration-300">
						<ReferencePanel parentGroup={parentGroup} />
					</div>
				)}

				{/* CENTER: Questions */}
				<div
					className={cn(
						"flex flex-col h-full min-h-0",
						parentGroup ? "col-span-4" : "col-span-10"
					)}>
					<div
						className="flex-1 pr-2 space-y-6 pb-4 overflow-y-auto hide-scrollbar scroll-smooth"
						ref={scrollContainerRef}>
						{visibleQuestions.map((q) => (
							<QuestionCard
								key={q.id}
								question={q}
								answer={answersMap[q.id]}
								onAnswer={(val) =>
									handleAnswer(q.id, val, q.type)
								}
								onFlag={() => toggleFlag(q.id)}
								isFlagged={flagged.includes(q.id)}
								isActive={q.index === currentIdx}
								onVisible={handleVisibleQuestion}
							/>
						))}
					</div>
				</div>

				{/* RIGHT: Palette */}
				<div className="flex col-span-2 flex-col h-full min-h-0">
					<QuestionPalette
						questions={questions}
						answers={answersMap}
						flagged={flagged}
						currentIdx={currentIdx}
						currentQuestion={currentQuestion}
						onNavClick={handleNavClick}
						onSubmit={submitAttempt}
					/>
				</div>
			</main>

			<TestFooter
				currentIdx={currentIdx}
				totalQuestions={questions.length}
				onNavClick={handleNavClick}
			/>

			<QuestionPalette
				questions={questions}
				answers={answersMap}
				flagged={flagged}
				currentIdx={currentIdx}
				currentQuestion={currentQuestion}
				onNavClick={handleNavClick}
				isOpen={isPaletteOpen}
				onClose={() => setIsPaletteOpen(false)}
				onSubmit={submitAttempt}
			/>

			{showExitModal && (
				<ConfirmationModal
					title="Rời khỏi bài thi?"
					variant="danger"
					confirmText="Rời khỏi"
					onConfirm={() => navigate("/dashboard")}
					onCancel={() => setShowExitModal(false)}>
					Bạn có chắc chắn muốn thoát? Kết quả làm bài của bạn sẽ
					không được lưu.
				</ConfirmationModal>
			)}
		</div>
	);
}
