import { useQuery } from "@tanstack/react-query";
import { fetchTestDetails } from "../apis/testApi";
import { normalize } from "normalizr";
import { test as TestSchema } from "../normalizr/testSchemas.js";

export function useTestEditorQuery(id) {
	return useQuery({
		queryKey: ["tests", id, "details"],
		queryFn: async () => {
			const test = await fetchTestDetails(id);
			const normalized = normalize(test, TestSchema);
			return normalized;
		},
	});
}
