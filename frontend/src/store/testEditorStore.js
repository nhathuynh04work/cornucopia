import { create } from "zustand";

export const useTestEditorStore = create((set, get) => ({
	// --------------------------
	// State
	// --------------------------
	test: null,
	sections: [],
	currentSectionId: null,
	currentItemInfo: null,
	groupOpenState: {},

	// --------------------------
	// Editor
	// --------------------------

	// --------------------------
	// Test helpers
	// --------------------------
	loadTest: (data) => {
		const { testSections, ...test } = data;
		set({
			test,
			sections: testSections || [],
			groupOpenState: {},
		});
	},

	updateTestSettings: (changes) => {
		set((state) => {
			if (!state.test) return {};
			return {
				test: { ...state.test, ...changes },
				sections: state.sections, // preserve sections
			};
		});
	},

	// --------------------------
	// Section helpers
	// --------------------------
	getCurrentSection: () => {
		const sections = get().sections;
		if (!sections.length) return null;

		const currentSectionId = get().currentSectionId;
		if (!currentSectionId) return sections[0];

		return sections.find((s) => s.id === get().currentSectionId);
	},

	changeCurrentSection: (sectionId) => {
		set(() => {
			return { currentSectionId: sectionId };
		});
	},

	getSectionsCount: () => get().sections.length,

	addSection: (newSection) => {
		set((state) => {
			const sections = [...state.sections, newSection].sort(
				(a, b) => a.sortOrder - b.sortOrder
			);
			return { sections };
		});
	},

	deleteSection: (sectionId) => {
		set((state) => {
			const sections = state.sections.filter((_, i) => i !== sectionId);
			return { sections };
		});
	},

	// --------------------------
	// Item helpers
	// --------------------------
	getCurrentItem: () => {
		const items = get().getItemsFlattened();
		const info = get().currentItemInfo;

		if (!info) return;

		return items.find(
			(item) => item.type === info.type && item.id === info.id
		);
	},

	changeCurrentItem: (id, type) => {
		set(() => {
			return { currentItemInfo: { id, type } };
		});
	},

	addItemToSection: (sectionId, newItem) => {
		set((state) => {
			const sections = structuredClone(state.sections);
			const section = sections.find((s) => s.id === sectionId);

			section.items = section.items || [];
			section.items.push(newItem);
			section.items.sort((a, b) => a.sortOrder - b.sortOrder);

			return { sections };
		});
	},

	addChildToGroup: (sectionId, itemId, newChild) => {
		set((state) => {
			const sections = structuredClone(state.sections);
			const section = sections.find((s) => s.id === sectionId);
			const group = section.items.find((item) => item.id === itemId);

			if (group.type !== "group") return {};
			group.children.push(newChild);
			group.children.sort((a, b) => a.sortOrder - b.sortOrder);
			return { sections };
		});
	},

	deleteItemFromSection: (sectionId, itemId) => {
		set((state) => {
			const sections = structuredClone(state.sections);
			const section = sections.find((s) => s.id === sectionId);
			if (!section) return {};

			section.items = section.items.filter((item) => item.id !== itemId);
			return { sections };
		});
	},

	deleteChildFromGroup: (sectionId, groupId, childId) => {
		set((state) => {
			const sections = structuredClone(state.sections);
			const section = sections.find((s) => s.id === sectionId);
			if (!section) return {};

			const group = section.items.find((i) => i.id === groupId);
			if (!group || group.type !== "group") return {};

			group.children = group.children.filter(
				(child) => child.id !== childId
			);

			return { sections };
		});
	},

	getItemsFlattened: () => {
		const sections = get().sections;
		const flat = [];

		sections
			.slice() // avoid mutating the store array
			.sort((a, b) => a.sortOrder - b.sortOrder)
			.forEach((section) => {
				(section.items || [])
					.slice()
					.sort((a, b) => a.sortOrder - b.sortOrder)
					.forEach((item) => {
						// Always push the item itself (question or group)
						flat.push(item);

						// If it's a group, also push its children right after
						if (item.type === "group") {
							(item.children || [])
								.slice()
								.sort((a, b) => a.sortOrder - b.sortOrder)
								.forEach((child) => flat.push(child));
						}
					});
			});

		return flat;
	},

	getQuestionsFlattened: () => {
		const items = get().getItemsFlattened();
		const questions = [];

		items.forEach((item) => {
			if (item.type !== "group") questions.push(item);
		});

		return questions;
	},

	getQuestionNumber: (questionId) => {
		const ordered = get().getQuestionsFlattened();
		const index = ordered.findIndex((q) => q.id === questionId);
		return index === -1 ? null : index + 1;
	},

	getGroupNumberRange: (sectionId, groupIndex) => {
		const section = get().sections.find((s) => s.id === sectionId);
		const group = section.items.find((item) => item.id === groupIndex);
		if (!group?.children?.length) return [null, null];
		const flat = get().getQuestionsFlattened();
		const firstIndex = flat.findIndex((q) => q.id === group.children[0].id);
		const lastIndex = flat.findIndex(
			(q) => q.id === group.children[group.children.length - 1].id
		);
		return [
			firstIndex === -1 ? null : firstIndex + 1,
			lastIndex === -1 ? null : lastIndex + 1,
		];
	},

	getAllQuestionNumbers: () => {
		return get()
			.getQuestionsFlattened()
			.map((_, i) => i + 1);
	},

	getQuestionsCount: () => {
		return get().getQuestionsFlattened().length;
	},

	// --------------------------
	// Group open/close state
	// --------------------------
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
