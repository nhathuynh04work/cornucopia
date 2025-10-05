import { create } from "zustand";

export const useTestEditorStore = create((set, get) => ({
	entities: {},
	result: null,
	questionsOrdered: null,

	// Load normalized test
	loadTest: (data) => {
		const flat = computeFlatQuestions(data.entities, data.result);
		set({
			entities: data.entities,
			result: data.result,
			questionsOrdered: flat,
		});
	},

	// Update an entity and re-flatten
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

	// Append child (item to section, item to item, answerOption to question, etc.)
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

	// Reset
	reset: () =>
		set({
			entities: {},
			result: null,
			questionsOrdered: null,
		}),

	// Get entity
	getEntity: (type, id) => {
		const { entities } = get();
		return entities?.[type]?.[id] ?? null;
	},

	// Get question number
	getQuestionNumber: (questionId) => {
		const ordered = get().questionsOrdered ?? [];
		const index = ordered.findIndex((q) => q.id === questionId);
		return index === -1 ? null : index + 1;
	},

	// Get all question numbers
	getAllQuestionNumbers: () => {
		const ordered = get().questionsOrdered ?? [];
		return ordered.map((q, index) => index + 1);
	},

	// Get questions count
	getQuestionsCount: () => {
		const ordered = get().questionsOrdered ?? [];
		return ordered.length;
	},

	// Get sections count
	getSectionsCount: () => {
		const sections = get().entities?.testSections ?? {};
		return Object.keys(sections).length;
	},

	// Delete entity (with cascade)
	deleteEntity: (type, id) => {
		set((state) => {
			const newEntities = { ...state.entities };

			// --- Step 1: find and unlink from parent ---
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

			// --- Step 2: cascade deletes ---
			if (type === "items") {
				const item = newEntities.items?.[id];
				// If question → delete answerOptions
				item?.answerOptions?.forEach((optId) => {
					delete newEntities.answerOptions?.[optId];
				});
				// If group → delete children recursively
				item?.children?.forEach((childId) => {
					get().deleteEntity("items", childId);
				});
			}

			// --- Step 3: delete itself ---
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

// Helper: recursively add questions
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
