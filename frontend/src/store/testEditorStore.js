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

	getGroupNumberRange: (groupId) => {
		const group = get().entities?.items?.[groupId];
		const ordered = get().questionsOrdered ?? [];

		if (!group?.children?.length) return [null, null];

		const firstChildId = group.children[0];
		const lastChildId = group.children[group.children.length - 1];

		const firstIndex = ordered.findIndex((q) => q.id === firstChildId);
		const lastIndex = ordered.findIndex((q) => q.id === lastChildId);

		return [
			firstIndex === -1 ? null : firstIndex + 1,
			lastIndex === -1 ? null : lastIndex + 1,
		];
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
			console.log(newEntities[type]);

			// Deep remove references in nested arrays
			for (const tableKey in newEntities) {
				const table = newEntities[tableKey];
				if (!table) continue;

				for (const entityId in table) {
					const entity = table[entityId];
					for (const key in entity) {
						if (Array.isArray(entity[key])) {
							entity[key] = entity[key].filter(
								(childId) => childId !== id
							);
						}
					}
				}
			}

			// Delete item and its children recursively
			if (type === "items") {
				const item = newEntities.items?.[id];
				if (item) {
					// Delete answer options
					item.answerOptions?.forEach((optId) => {
						delete newEntities.answerOptions?.[optId];
					});

					// Recursively delete children
					item.children?.forEach((childId) => {
						newEntities.items?.[childId] &&
							deleteEntityRecursively(
								newEntities,
								"items",
								childId
							);
					});
				}
			}

			// Delete the item itself
			if (newEntities[type]?.[id]) {
				newEntities[type] = { ...newEntities[type] };
				delete newEntities[type][id];
			}

			console.log(newEntities[type]);

			return {
				entities: newEntities,
				questionsOrdered: computeFlatQuestions(
					newEntities,
					state.result
				),
			};
		});
	},

	changeCurrentSection: (id) => {
		set((state) => {
			const section = state.entities.testSections[id];
			if (!section) return { currentSection: null };

			const filteredItems =
				section.items?.filter(
					(itemId) => state.entities.items[itemId] // only keep existing items
				) || [];

			return {
				currentSection: {
					...section,
					items: filteredItems,
				},
			};
		});
	},
}));

// Recursively flatten all questions
function computeFlatQuestions(entities, testId) {
	if (!testId) return [];

	const test = entities.tests?.[testId];
	if (!test?.testSections?.length) return [];

	const flat = [];

	const sections = test.testSections
		.map((id) => entities.testSections?.[id])
		.filter(Boolean)
		.sort((a, b) => a.sortOrder - b.sortOrder);

	for (const section of sections) {
		const items = (section.items ?? [])
			.map((id) => entities.items?.[id])
			.filter(Boolean)
			.sort((a, b) => a.sortOrder - b.sortOrder);

		for (const item of items) {
			if (item.type === "question") {
				// Direct question in section
				flat.push(item);
			} else if (item.type === "group" && item.children?.length) {
				// Add all child questions of group
				const children = item.children
					.map((id) => entities.items?.[id])
					.filter(Boolean)
					.sort((a, b) => a.sortOrder - b.sortOrder);

				flat.push(...children);
			}
		}
	}

	return flat;
}

function deleteEntityRecursively(entities, type, id) {
	const item = entities[type]?.[id];
	if (!item) return;

	item.answerOptions?.forEach(
		(optId) => delete entities.answerOptions?.[optId]
	);
	item.children?.forEach((childId) =>
		deleteEntityRecursively(entities, type, childId)
	);

	entities[type] = { ...entities[type] };
	delete entities[type][id];
}
