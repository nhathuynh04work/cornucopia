import { itemTypeEnum } from "@/lib/item.config";
import { create } from "zustand";

export const useTestEditorStore = create((set, get) => ({
	// CORE STATE
	test: {
		items: [],
	},
	currentItemId: null,
	groupOpenState: {},

	// DERIVED STATE
	_flatItems: [],
	_flatQuestions: [],

	// Test
	setTest: (data) => {
		const { flatItems, flatQuestions } = flattenTestItems(data?.items);
		set({
			test: data,
			_flatItems: flatItems,
			_flatQuestions: flatQuestions,
		});
	},

	updateTestSettings: (updated) => {
		set((state) => ({ test: { ...state.test, ...updated } }));
	},

	// Item
	changeCurrentItem: (itemId) => {
		set({ currentItemId: itemId });
	},

	getCurrentItem: () => {
		const { currentItemId, _flatItems } = get();
		if (!currentItemId) return _flatItems[0];
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

		// Find the group from the flattened list
		const group = _flatItems.find((item) => item.id === groupId);

		// Ensure it's a group and has children
		if (!group || group.type !== "group" || !group.children?.length) {
			return [null, null];
		}

		// Find the first + last child
		const firstChild = group.children[0];
		const lastChild = group.children[group.children.length - 1];

		// Find index of first = last
		const firstIndex = _flatQuestions.findIndex(
			(q) => q.id === firstChild.id
		);
		const lastIndex = _flatQuestions.findIndex(
			(q) => q.id === lastChild.id
		);

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

function flattenTestItems(items = []) {
	const flatItems = items
		.slice()
		.sort((a, b) => a.sortOrder - b.sortOrder)
		.flatMap((item) =>
			item.type === itemTypeEnum.GROUP
				? [
						item,
						...(item.children || [])
							.slice()
							.sort((a, b) => a.sortOrder - b.sortOrder),
				  ]
				: [item]
		);

	const flatQuestions = flatItems.filter(
		(item) => item.type !== itemTypeEnum.GROUP
	);

	return { flatItems, flatQuestions };
}
