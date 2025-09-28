import { create } from "zustand";

export const useTestEditorStore = create((set, get) => ({
	entities: {},
	result: null,

	loadTest: (data) => {
		set({
			entities: data.entities,
			result: data.result,
		});
	},

	updateEntities: (type, id, changes) => {
		set((state) => ({
			entities: {
				...state.entities,
				[type]: {
					...(state.entities[type] ?? {}),
					[id]: {
						...(state.entities[type]?.[id] ?? {}),
						...changes,
					},
				},
			},
		}));
	},

	appendChildToParent: (parentType, parentId, relationKey, childId) => {
		set((state) => {
			const parent = state.entities[parentType][parentId];
			return {
				entities: {
					...state.entities,
					[parentType]: {
						...state.entities[parentType],
						[parentId]: {
							...parent,
							[relationKey]: [
								...(parent[relationKey] || []),
								childId,
							],
						},
					},
				},
			};
		});
	},

	reset: () =>
		set({
			entities: {},
			result: null,
		}),

	getEntity: (type, id) => {
		const { entities } = get();
		return entities?.[type]?.[id] ?? null;
	},
}));
