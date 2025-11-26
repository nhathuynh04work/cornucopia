import { useState, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetTestForAttempt } from "@/hooks/useTestQuery";
import { useSubmitTest, formatTestPayload } from "@/hooks/useSubmitTest";
import { getQuestionNumberMap } from "@/lib/testHelpers";
import { cn } from "@/lib/formatters";
import { Loader2, AlertCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import TestHeader from "@/components/TestAttempt/TestHeader";
import TestFooter from "@/components/TestAttempt/TestFooter";
import ReferencePanel from "@/components/TestAttempt/ReferencePanel";
import QuestionCard from "@/components/TestAttempt/QuestionCard";
import QuestionPalette from "@/components/TestAttempt/QuestionPalette";
import MediaAttachment from "@/components/TestAttempt/MediaAttachment";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";

export default function TestAttempt() {
	const { testId } = useParams();
	const navigate = useNavigate();
	const scrollContainerRef = useRef(null);

	const {
		isPending,
		isError,
		error,
		data: test,
	} = useGetTestForAttempt(testId);
	const { mutate: submitTest, isPending: isSubmitting } = useSubmitTest();

	const [currentIdx, setCurrentIdx] = useState(0);
	const [answers, setAnswers] = useState({});
	const [flagged, setFlagged] = useState([]);
	const [isPaletteOpen, setIsPaletteOpen] = useState(false);
	const [showExitModal, setShowExitModal] = useState(false);

	const isProgrammaticScroll = useRef(false);

	const { questions } = useMemo(() => {
		if (!test?.items) return { questions: [], questionMap: {} };

		const map = getQuestionNumberMap(test.items);
		const flatList = [];
		let idxCounter = 0;

		test.items.forEach((item) => {
			if (item.type === "GROUP") {
				if (item.children) {
					item.children.forEach((child) => {
						flatList.push({
							...child,
							parent: item,
							parentId: item.id,
							index: idxCounter++,
							displayNumber: map[child.id]?.display,
						});
					});
				}
			} else {
				flatList.push({
					...item,
					parent: null,
					parentId: `single-${item.id}`,
					index: idxCounter++,
					displayNumber: map[item.id]?.display,
				});
			}
		});

		return { questions: flatList, questionMap: map };
	}, [test]);

	const totalQuestions = questions.length;
	const currentQuestion = questions[currentIdx];
	const parentGroup = currentQuestion?.parent;

	const visibleQuestions = useMemo(() => {
		if (!currentQuestion) return [];
		if (parentGroup) {
			return questions.filter((q) => q.parentId === parentGroup.id);
		}
		return [currentQuestion];
	}, [currentQuestion, questions, parentGroup]);

	const answeredCount = Object.keys(answers).length;
	const progress =
		totalQuestions > 0
			? Math.round((answeredCount / totalQuestions) * 100)
			: 0;

	const handleAnswer = (itemId, value) => {
		setAnswers((prev) => ({ ...prev, [itemId]: value }));
	};

	const toggleFlag = (itemId) => {
		setFlagged((prev) =>
			prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId]
		);
	};

	const handleNavClick = (index) => {
		isProgrammaticScroll.current = true;
		setCurrentIdx(index);
		setTimeout(() => {
			isProgrammaticScroll.current = false;
		}, 800);
	};

	const handleVisibleQuestion = useCallback((index) => {
		if (!isProgrammaticScroll.current) {
			setCurrentIdx(index);
		}
	}, []);

	const handleSubmit = () => {
		if (isSubmitting) return;
		const timeSpent = test.timeLimit;
		const payload = formatTestPayload(testId, timeSpent, answers);

		submitTest(payload, {
			onSuccess: (attempt) => {
				toast.success("Test submitted successfully!");
				navigate(`/tests/${testId}/result/${attempt.id}`);
			},
		});
	};

	const handleConfirmExit = () => {
		navigate("/dashboard");
	};

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

	return (
		<div className="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
			<TestHeader
				title={test.title}
				currentIdx={currentIdx}
				totalQuestions={totalQuestions}
				audioUrl={test.audioUrl}
				progress={progress}
				timeLimit={test.timeLimit}
				onTogglePalette={() => setIsPaletteOpen(true)}
				onSubmit={handleSubmit}
				onExit={() => setShowExitModal(true)}
			/>

			<main className="flex-1 min-h-0 w-full max-w-[1800px] mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-6 p-4 lg:p-6 lg:overflow-hidden">
				{/* LEFT: Reference Panel */}
				{parentGroup && (
					<div className="hidden lg:flex lg:col-span-6 xl:col-span-6 flex-col h-full min-h-0 animate-in fade-in duration-300">
						<ReferencePanel parentGroup={parentGroup} />
					</div>
				)}

				{/* CENTER: Questions */}
				<div
					className={cn(
						"flex flex-col h-full min-h-0",
						parentGroup
							? "lg:col-span-6 xl:col-span-4"
							: "lg:col-span-12 xl:col-span-10"
					)}>
					{/* Mobile Reference Toggle */}
					{parentGroup && (
						<div className="lg:hidden bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4 flex-none">
							<details className="group">
								<summary className="flex items-center justify-between font-bold text-gray-700 cursor-pointer list-none">
									<span>Xem tài liệu tham khảo</span>
									<ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
								</summary>
								<div className="mt-4 pt-4 border-t border-gray-100 prose prose-sm max-w-none">
									<MediaAttachment
										mediaList={parentGroup.media}
									/>
									<div
										dangerouslySetInnerHTML={{
											__html: parentGroup.text,
										}}
									/>
								</div>
							</details>
						</div>
					)}

					<div
						className="flex-1 pr-2 space-y-6 pb-4 overflow-y-auto hide-scrollbar scroll-smooth"
						ref={scrollContainerRef}>
						{visibleQuestions.map((q) => (
							<QuestionCard
								key={q.id}
								question={q}
								answer={answers[q.id]}
								onAnswer={(val) => handleAnswer(q.id, val)}
								onFlag={() => toggleFlag(q.id)}
								isFlagged={flagged.includes(q.id)}
								isActive={q.index === currentIdx}
								onVisible={handleVisibleQuestion}
							/>
						))}
					</div>
				</div>

				{/* RIGHT: Palette */}
				<div className="hidden xl:flex xl:col-span-2 flex-col h-full min-h-0">
					<QuestionPalette
						questions={questions}
						answers={answers}
						flagged={flagged}
						currentIdx={currentIdx}
						currentQuestion={currentQuestion}
						onNavClick={handleNavClick}
						onSubmit={handleSubmit}
					/>
				</div>
			</main>

			<TestFooter
				currentIdx={currentIdx}
				totalQuestions={totalQuestions}
				onNavClick={handleNavClick}
			/>

			<QuestionPalette
				questions={questions}
				answers={answers}
				flagged={flagged}
				currentIdx={currentIdx}
				currentQuestion={currentQuestion}
				onNavClick={handleNavClick}
				isOpen={isPaletteOpen}
				onClose={() => setIsPaletteOpen(false)}
				onSubmit={handleSubmit}
			/>

			{/* Confirmation Modal for Exit */}
			{showExitModal && (
				<ConfirmationModal
					title="Rời khỏi bài thi?"
					variant="danger"
					confirmText="Rời khỏi"
					onConfirm={handleConfirmExit}
					onCancel={() => setShowExitModal(false)}>
					Bạn có chắc chắn muốn thoát? Kết quả làm bài của bạn sẽ
					không được lưu.
				</ConfirmationModal>
			)}
		</div>
	);
}
