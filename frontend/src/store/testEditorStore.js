import { create } from "zustand";

export const useTestEditorStore = create((set, get) => ({
	// CORE STATE
	test: {
		testSections: [],
	},
	currentSectionId: null,
	currentItemId: null,
	groupOpenState: {},

	// DERIVED STATE
	_flatItems: [],
	_flatQuestions: [],

	// Test
	loadTest: (data) => {
		const { flatItems, flatQuestions } = flattenSections(
			data?.testSections
		);
		set({
			test: data,
			_flatItems: flatItems,
			_flatQuestions: flatQuestions,
		});
	},

	updateTestSettings: (updated) => {
		set((state) => ({ test: { ...state.test, ...updated } }));
	},

	// Section
	getCurrentSection: () => {
		const sections = get().test.testSections;
		if (!sections.length) return null;

		const currentSectionId = get().currentSectionId;
		if (!currentSectionId) return sections[0];

		return sections.find((s) => s.id === currentSectionId);
	},

	changeCurrentSection: (sectionId) => {
		set(() => ({ currentSectionId: sectionId }));
	},

	addSection: (newSection) => {
		set((state) => {
			const newTestSections = [...state.test.testSections, newSection];
			const { flatItems, flatQuestions } =
				flattenSections(newTestSections);

			return {
				test: { ...state.test, testSections: newTestSections },
				_flatItems: flatItems,
				_flatQuestions: flatQuestions,
			};
		});
	},

	deleteSection: (sectionId) => {
		set((state) => {
			const newTestSections = state.test.testSections.filter(
				(section) => section.id !== sectionId
			);
			const { flatItems, flatQuestions } =
				flattenSections(newTestSections);

			let newCurrentSectionId = state.currentSectionId;
			if (state.currentSectionId === sectionId) {
				newCurrentSectionId = newTestSections[0]?.id || null;
			}

			return {
				test: { ...state.test, testSections: newTestSections },
				currentSectionId: newCurrentSectionId,
				_flatItems: flatItems,
				_flatQuestions: flatQuestions,
			};
		});
	},

	updateSection: (updatedSection) => {
		set((state) => {
			const newTestSections = state.test.testSections.map((section) =>
				section.id === updatedSection.id ? updatedSection : section
			);
			const { flatItems, flatQuestions } =
				flattenSections(newTestSections);

			return {
				test: { ...state.test, testSections: newTestSections },
				_flatItems: flatItems,
				_flatQuestions: flatQuestions,
			};
		});
	},

	// Item
	changeCurrentItem: (itemId) => {
		set({ currentItemId: itemId });
	},

	getCurrentItem: () => {
		const { currentItemId, _flatItems } = get();
		if (!currentItemId) return undefined;
		return _flatItems.find((item) => item.id === currentItemId);
	},

	getItemsFlattened: () => get()._flatItems,

	getQuestionsFlattened: () => get()._flatQuestions,

	getQuestionNumber: (questionId) => {
		const index = get()._flatQuestions.findIndex(
			(q) => q.id === questionId
		);
		return index === -1 ? null : index + 1;
	},

	getQuestionsCount: () => get()._flatQuestions.length,

	getGroupNumberRange: (groupId) => {
		const { _flatItems, _flatQuestions } = get();
		const group = _flatItems.find((item) => item.id === groupId);

		if (!group || group.type !== "group" || !group.children?.length) {
			return [null, null];
		}

		const firstChildId = group.children[0].id;
		const lastChildId = group.children[group.children.length - 1].id;

		const firstIndex = _flatQuestions.findIndex(
			(q) => q.id === firstChildId
		);
		const lastIndex = _flatQuestions.findIndex((q) => q.id === lastChildId);

		return [
			firstIndex === -1 ? null : firstIndex + 1,
			lastIndex === -1 ? null : lastIndex + 1,
		];
	},

	// Group open/close state
	toggleGroupOpen: (groupId) => {
		set((state) => ({
			groupOpenState: {
				...state.groupOpenState,
				[groupId]: !state.groupOpenState[groupId],
			},
		}));
	},

	setGroupOpen: (groupId, isOpen) => {
		set((state) => ({
			groupOpenState: { ...state.groupOpenState, [groupId]: isOpen },
		}));
	},

	isGroupOpen: (groupId) => {
		return get().groupOpenState[groupId] ?? false;
	},
}));

const flattenSections = (sections = []) => {
	const flatItems = sections
		.slice()
		.sort((a, b) => a.sortOrder - b.sortOrder)
		.flatMap((section) =>
			(section.items || [])
				.slice()
				.sort((a, b) => a.sortOrder - b.sortOrder)
				.flatMap((item) =>
					item.type === "group"
						? [
								item,
								...(item.children || [])
									.slice()
									.sort((a, b) => a.sortOrder - b.sortOrder),
						  ]
						: [item]
				)
		);

	const flatQuestions = flatItems.filter((item) => item.type !== "group");

	return { flatItems, flatQuestions };
};
