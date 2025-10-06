import { create } from "zustand";

export const useTestEditorStore = create((set, get) => ({
	entities: {},
	result: null,
	questionsOrdered: null,
	currentSection: null,
	groupOpenState: {},

	toggleGroupOpen: (id) => {
		set((state) => ({
			groupOpenState: {
				...state.groupOpenState,
				[id]: !state.groupOpenState[id],
			},
		}));
	},

	setGroupOpen: (id, isOpen) =>
		set((state) => ({
			groupOpenState: {
				...state.groupOpenState,
				[id]: isOpen,
			},
		})),

	isGroupOpen: (id) => {
		return get().groupOpenState[id] ?? false;
	},

	loadTest: (data) => {
		const flat = computeFlatQuestions(data.entities, data.result);
		const test = data.entities.tests[data.result];
		const firstSection = data.entities.testSections[test.testSections[0]];

		set({
			entities: data.entities,
			result: data.result,
			questionsOrdered: flat,
			currentSection: firstSection,
		});
	},

	updateEntities: (type, id, changes) => {
		set((state) => {
			const newEntities = {
				...state.entities,
				[type]: {
					...(state.entities[type] ?? {}),
					[id]: {
						...(state.entities[type]?.[id] ?? {}),
						...changes,
					},
				},
			};

			return {
				entities: newEntities,
				questionsOrdered: computeFlatQuestions(
					newEntities,
					state.result
				),
			};
		});
	},

	appendChildToParent: (parentType, parentId, relationKey, childId) => {
		set((state) => {
			const parent = state.entities[parentType]?.[parentId] ?? {};
			const newEntities = {
				...state.entities,
				[parentType]: {
					...state.entities[parentType],
					[parentId]: {
						...parent,
						[relationKey]: [
							...(parent[relationKey] ?? []),
							childId,
						],
					},
				},
			};
			return {
				entities: newEntities,
				questionsOrdered: computeFlatQuestions(
					newEntities,
					state.result
				),
			};
		});
	},

	getEntity: (type, id) => {
		const { entities } = get();
		return entities?.[type]?.[id] ?? null;
	},

	getQuestionNumber: (questionId) => {
		const ordered = get().questionsOrdered ?? [];
		const index = ordered.findIndex((q) => q.id === questionId);
		return index === -1 ? null : index + 1;
	},

	getAllQuestionNumbers: () => {
		const ordered = get().questionsOrdered ?? [];
		return ordered.map((q, index) => index + 1);
	},

	getQuestionsCount: () => {
		const ordered = get().questionsOrdered ?? [];
		return ordered.length;
	},

	getSectionsCount: () => {
		const sections = get().entities?.testSections ?? {};
		return Object.keys(sections).length;
	},

	deleteEntity: (type, id) => {
		set((state) => {
			const newEntities = { ...state.entities };

			Object.values(newEntities).forEach((table) => {
				Object.values(table ?? {}).forEach((entity) => {
					for (const key in entity) {
						if (Array.isArray(entity[key])) {
							entity[key] = entity[key].filter(
								(childId) => childId !== id
							);
						}
					}
				});
			});

			if (type === "items") {
				const item = newEntities.items?.[id];
				item?.answerOptions?.forEach((optId) => {
					delete newEntities.answerOptions?.[optId];
				});
				item?.children?.forEach((childId) => {
					get().deleteEntity("items", childId);
				});
			}

			newEntities[type] = { ...newEntities[type] };
			delete newEntities[type][id];

			return {
				entities: newEntities,
				questionsOrdered: computeFlatQuestions(
					newEntities,
					state.result
				),
			};
		});
	},

	changeCurrentSection: (id) =>
		set({ currentSection: get().entities.testSections[id] }),
}));

// Recursively flatten all questions
function computeFlatQuestions(entities, result) {
	if (!result) return [];
	const test = entities.tests?.[result];
	if (!test?.testSections) return [];

	const flat = [];

	(test.testSections ?? [])
		.map((sectionId) => entities.testSections[sectionId])
		.filter(Boolean)
		.sort((a, b) => a.sortOrder - b.sortOrder)
		.forEach((section) => {
			(section.items ?? [])
				.map((itemId) => entities.items[itemId])
				.filter(Boolean)
				.sort((a, b) => a.sortOrder - b.sortOrder)
				.forEach((item) => traverseItems(item, entities, flat));
		});

	return flat;
}

function traverseItems(item, entities, flat) {
	if (!item) return;
	if (item.type === "question") {
		flat.push(item);
	}
	if (item.children?.length) {
		item.children
			.map((childId) => entities.items[childId])
			.filter(Boolean)
			.sort((a, b) => a.sortOrder - b.sortOrder)
			.forEach((child) => traverseItems(child, entities, flat));
	}
}
