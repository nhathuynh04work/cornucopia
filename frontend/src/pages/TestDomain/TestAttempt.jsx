import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, FileText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/formatters";

import TestHeader from "@/components/TestAttempt/TestHeader";
import TestFooter from "@/components/TestAttempt/TestFooter";
import ReferencePanel from "@/components/TestAttempt/ReferencePanel";
import QuestionCard from "@/components/TestAttempt/QuestionCard";
import QuestionPalette from "@/components/TestAttempt/QuestionPalette";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";
import { useTestAttempt } from "@/hooks/useTestAttempt";
import SEO from "@/components/Shared/SEO";

export default function TestAttempt() {
	const { testId } = useParams();
	const navigate = useNavigate();

	const scrollContainerRef = useRef(null);
	const isProgrammaticScroll = useRef(false);
	const [isPaletteOpen, setIsPaletteOpen] = useState(false);
	const [showExitModal, setShowExitModal] = useState(false);

	const [mobileView, setMobileView] = useState("QUESTION");

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

	useEffect(() => {
		setMobileView("QUESTION");
	}, [currentIdx]);

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

	const visibleQuestions = parentGroup
		? questions.filter((q) => q.parentId === parentGroup.id)
		: [currentQuestion];

	return (
		<>
			<div className="h-[100dvh] bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
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

				{/* Mobile Tabs for Parent Group (Reading Passage vs Questions) */}
				{parentGroup && (
					<div className="lg:hidden flex-none bg-white border-b border-gray-200 px-4 py-2 flex gap-2">
						<button
							onClick={() => setMobileView("REFERENCE")}
							className={cn(
								"flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors",
								mobileView === "REFERENCE"
									? "bg-purple-100 text-purple-700"
									: "bg-gray-50 text-gray-500 hover:bg-gray-100"
							)}>
							<FileText className="w-4 h-4" />
							Tài liệu
						</button>
						<button
							onClick={() => setMobileView("QUESTION")}
							className={cn(
								"flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors",
								mobileView === "QUESTION"
									? "bg-purple-100 text-purple-700"
									: "bg-gray-50 text-gray-500 hover:bg-gray-100"
							)}>
							<HelpCircle className="w-4 h-4" />
							Câu hỏi
						</button>
					</div>
				)}

				<main className="flex-1 min-h-0 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden relative">
					{/* LEFT: Reference Panel */}
					{parentGroup && (
						<div
							className={cn(
								"flex flex-col h-full min-h-0 animate-in fade-in duration-300",

								"lg:col-span-6 lg:flex",

								mobileView === "REFERENCE"
									? "flex col-span-1"
									: "hidden"
							)}>
							<ReferencePanel parentGroup={parentGroup} />
						</div>
					)}

					{/* CENTER: Questions */}
					<div
						className={cn(
							"flex flex-col h-full min-h-0",

							parentGroup ? "lg:col-span-4" : "lg:col-span-10",

							!parentGroup || mobileView === "QUESTION"
								? "flex col-span-1"
								: "hidden lg:flex"
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

					{/* RIGHT: Palette (Desktop Only) */}
					<div className="hidden lg:flex lg:col-span-2 flex-col h-full min-h-0">
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

				{/* Mobile Palette Drawer */}
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

			<SEO
				title={`Thực hiện bài thi | ${test.title}`}
				description={`Thực hiện bài thi | ${test.title}`}
			/>
		</>
	);
}
