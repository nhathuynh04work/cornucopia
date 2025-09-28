import { create } from "zustand";

export const useTestEditorStore = create((set, get) => ({
	entities: {},
	result: null,
	_flatQuestionsCache: null,

	// Load test and precompute flat questions
	loadTest: (data) => {
		const flat = computeFlatQuestions(data.entities, data.result);
		set({
			entities: data.entities,
			result: data.result,
			_flatQuestionsCache: flat,
		});
	},

	// Update an entity and invalidate cache
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
				_flatQuestionsCache: computeFlatQuestions(
					newEntities,
					state.result
				),
			};
		});
	},

	// Append a child to parent and invalidate cache
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
				_flatQuestionsCache: computeFlatQuestions(
					newEntities,
					state.result
				),
			};
		});
	},

	// Reset the store
	reset: () =>
		set({
			entities: {},
			result: null,
			_flatQuestionsCache: null,
		}),

	// Get entity by type and ID
	getEntity: (type, id) => {
		const { entities } = get();
		return entities?.[type]?.[id] ?? null;
	},

	// Get the sequential question number in the whole test
	getQuestionNumber: (questionId) => {
		const flatQuestions = get()._flatQuestionsCache ?? [];
		const index = flatQuestions.findIndex((q) => q.id === questionId);
		return index === -1 ? null : index + 1;
	},
}));

// Helper to compute flat questions from normalized entities
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
			(section.questionGroups ?? [])
				.map((groupId) => entities.questionGroups[groupId])
				.filter(Boolean)
				.sort((a, b) => a.sortOrder - b.sortOrder)
				.forEach((group) => {
					(group.questions ?? [])
						.map((qId) => entities.questions[qId])
						.filter(Boolean)
						.sort((a, b) => a.sortOrder - b.sortOrder)
						.forEach((question) => flat.push(question));
				});
		});

	return flat;
}
