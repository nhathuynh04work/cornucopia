import { normalize } from "normalizr";
import { create } from "zustand";
import { test as TestSchema } from "../normalizr/testSchemas.js";

export const useTestEditorStore = create((set) => ({
	entities: {},
	result: null,

	loadTest: (data) => {
		const normalized = normalize(data, TestSchema);

		set({
			entities: normalized.entities,
			result: normalized.result,
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
}));
