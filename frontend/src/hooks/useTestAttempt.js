import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useGetTestForAttempt } from "@/hooks/useTestQuery";
import { useSubmitTest } from "@/hooks/useSubmitTest";
import { getQuestionNumberMap, flattenTestItems } from "@/lib/testHelpers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export function useTestAttempt(testId) {
	const startTimeRef = useRef(null);
	const navigate = useNavigate();

	// 1. Data Fetching
	const {
		data: test,
		isPending,
		isError,
		error,
	} = useGetTestForAttempt(testId);

	const { mutate: submitTest, isPending: isSubmitting } = useSubmitTest();

	// 2. Local State
	const [currentIdx, setCurrentIdx] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [flagged, setFlagged] = useState([]);

	// 3. Timer Initialization
	useEffect(() => {
		if (test && !startTimeRef.current) {
			startTimeRef.current = Date.now();
		}
	}, [test]);

	// 4. Data Processing (Structure & Flattening)
	const { questions } = useMemo(() => {
		if (!test?.items) return { questions: [], questionMap: {} };

		const map = getQuestionNumberMap(test.items);
		const { flatQuestions } = flattenTestItems(test.items, {
			attachParent: true,
		});

		const processedQuestions = flatQuestions.map((q, index) => ({
			...q,
			index,
			displayNumber: map[q.id]?.display || (index + 1).toString(),
		}));

		return { questions: processedQuestions, questionMap: map };
	}, [test]);

	// 5. Answer State Initialization
	useEffect(() => {
		if (questions.length > 0 && answers.length === 0) {
			const initialAnswers = questions.map((q) => ({
				questionId: Number(q.id),
				text: "",
				optionIds: [],
			}));
			setAnswers(initialAnswers);
		}
	}, [questions, answers.length]);

	// 6. Derived State (Maps & Progress)
	const answersMap = useMemo(() => {
		const map = {};
		answers.forEach((a) => {
			if (a.text) map[a.questionId] = a.text;
			if (a.optionIds && a.optionIds.length > 0)
				map[a.questionId] = a.optionIds;
		});
		return map;
	}, [answers]);

	const progress =
		questions.length > 0
			? Math.round(
					(Object.keys(answersMap).length / questions.length) * 100
			  )
			: 0;

	// 7. Actions
	const handleAnswer = useCallback((itemId, value, type) => {
		setAnswers((prev) =>
			prev.map((ans) => {
				if (ans.questionId === Number(itemId)) {
					if (type === "MULTIPLE_CHOICE") {
						const valArray = Array.isArray(value) ? value : [value];
						return {
							...ans,
							optionIds: valArray.map(Number),
							text: "",
						};
					} else {
						return { ...ans, text: String(value), optionIds: [] };
					}
				}
				return ans;
			})
		);
	}, []);

	const toggleFlag = useCallback((itemId) => {
		setFlagged((prev) =>
			prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId]
		);
	}, []);

	const submitAttempt = useCallback(() => {
		if (isSubmitting) return;

		const timeSpent = startTimeRef.current
			? Math.floor((Date.now() - startTimeRef.current) / 1000)
			: 0;

		const payload = {
			testId: Number(testId),
			time: timeSpent,
			answers: answers,
		};

		submitTest(payload, {
			onSuccess: (attempt) => {
				toast.success("Nộp bài thành công");
				navigate(`/tests/${testId}/result/${attempt.id}`);
			},
		});
	}, [isSubmitting, testId, answers, submitTest, navigate]);

	return {
		// Data
		test,
		questions,
		currentQuestion: questions[currentIdx],

		// Status
		isPending,
		isError,
		error,
		isSubmitting,
		progress,

		// State
		currentIdx,
		answersMap, // Exposed for UI O(1) lookups
		flagged,

		// Actions
		setCurrentIdx,
		handleAnswer,
		toggleFlag,
		submitAttempt,
	};
}
