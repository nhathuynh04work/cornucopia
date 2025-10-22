import { create } from "zustand";
import { flattenTestItems } from "./testEditorStore";

export const useTestAttemptStore = create((set) => ({
	// STATE
	test: {},
	items: [], // nested for UI
	questions: [], // flatten questions for answering
	answers: {},
	timeLimit: 0,
	timeLeft: 0,

	// ACTIONS
	setTest: (test) => {
		const { items: nestedItems, timeLimit, ...testInfo } = test;
		const { flatQuestions } = flattenTestItems(nestedItems);

		const initialAnswers = {};
		flatQuestions.forEach((item) => {
			initialAnswers[item.id] = {
				questionId: item.id,
				text: "",
				optionIds: [],
			};
		});

		set({
			test: testInfo,
			items: nestedItems,
			questions: flatQuestions,
			timeLimit: timeLimit,
			timeLeft: timeLimit,
			answers: initialAnswers,
		});
	},

	addAnswer: (questionId, answerPayload) => {
		set((state) => ({
			answers: {
				...state.answers,
				[questionId]: {
					...state.answers[questionId],
					...answerPayload,
				},
			},
		}));
	},

	tick: () => {
		set((state) => {
			if (state.timeLeft <= 0) {
				return { timeLeft: 0 };
			}
			return { timeLeft: state.timeLeft - 1 };
		});
	},

	reset: () => {
		set({
			test: {},
			items: [],
			questions: [],
			answers: {},
			timeLimit: 0,
			timeLeft: 0,
		});
	},
}));
