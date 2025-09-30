import { create } from "zustand";

const parentConfig = {
	// parentType: the entity’s parent table.
	// relationKey: the array field on the parent that holds children.
	// parentIdKey: the attribute on the child that points back to its parent.

	testSections: {
		parentType: "tests",
		relationKey: "testSections",
		parentIdKey: "testId",
	},
	questionGroups: {
		parentType: "testSections",
		relationKey: "questionGroups",
		parentIdKey: "sectionId",
	},
	questions: {
		parentType: "questionGroups",
		relationKey: "questions",
		parentIdKey: "groupId",
	},
	answerOptions: {
		parentType: "questions",
		relationKey: "answerOptions",
		parentIdKey: "questionId",
	},
};

export const useTestEditorStore = create((set, get) => ({
	entities: {},
	result: null,
	questionsOrdered: null,

	// Load test and precompute flat questions
	loadTest: (data) => {
		const flat = computeFlatQuestions(data.entities, data.result);
		set({
			entities: data.entities,
			result: data.result,
			questionsOrdered: flat,
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
				questionsOrdered: computeFlatQuestions(
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
				questionsOrdered: computeFlatQuestions(
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
			questionsOrdered: null,
		}),

	// Get entity by type and ID
	getEntity: (type, id) => {
		const { entities } = get();
		return entities?.[type]?.[id] ?? null;
	},

	// Get the sequential question number in the whole test
	getQuestionNumber: (questionId) => {
		const ordered = get().questionsOrdered ?? [];
		const index = ordered.findIndex((q) => q.id === questionId);
		return index === -1 ? null : index + 1;
	},

	// Get only the
	getAllQuestionNumbers: () => {
		const ordered = get().questionsOrdered ?? [];
		return ordered.map((q, index) => index + 1);
	},

	// Delete an entity from store
	deleteEntity: (type, id) => {
		const { parentType, relationKey, parentIdKey } = parentConfig[type];

		set((state) => {
			const newEntities = { ...state.entities };

			// Step 1: Remove from parent directly
			const entity = newEntities[type]?.[id];
			const parentId = entity[parentIdKey];
			const parent = newEntities[parentType]?.[parentId];

			newEntities[parentType] = {
				...newEntities[parentType],
				[parentId]: {
					...parent,
					[relationKey]: parent[relationKey].filter(
						(childId) => childId !== id
					),
				},
			};

			// Step 2: Cascade delete if question → remove its options
			if (type === "questions") {
				const question = newEntities.questions?.[id];
				question?.answerOptions?.forEach((optionId) => {
					delete newEntities.answerOptions?.[optionId];
				});
			}

			// Step 3: Delete the entity itself
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
