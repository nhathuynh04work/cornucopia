import { useQuery } from "@tanstack/react-query";
import { fetchTestDetails } from "../apis/testApi";
import { normalize } from "normalizr";
import { test as TestSchema } from "../normalizr/testSchemas.js";
import { useTestEditorStore } from "../store/testEditorStore.js";
import { useEffect } from "react";

export function useTestEditorQuery(id) {
	const loadTest = useTestEditorStore((s) => s.loadTest);

	const query = useQuery({
		queryKey: ["tests", id, "full"],
		queryFn: async () => {
			const test = await fetchTestDetails(id);
			return normalize(test, TestSchema);
		},
	});

	// Hydrate store when query resolves
	useEffect(() => {
		if (query.data) {
			loadTest(query.data);
		}
	}, [query.data, loadTest]);

	return query;
}
