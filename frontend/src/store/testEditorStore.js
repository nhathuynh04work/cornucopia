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
					...state.entities[type],
					[id]: {
						...state.entities[type]?.[id],
						...changes,
					},
				},
			},
		}));
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
