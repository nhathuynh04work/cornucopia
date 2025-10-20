import { useQuery } from "@tanstack/react-query";
import { fetchTestDetails } from "../apis/testApi";
import { useTestEditorStore } from "../store/testEditorStore.js";
import { useEffect } from "react";

export function useTestEditorQuery(id) {
	const setTest = useTestEditorStore((s) => s.setTest);

	const query = useQuery({
		queryKey: ["tests", id, "full"],
		queryFn: () => fetchTestDetails(id),
	});

	// Hydrate store when query resolves
	useEffect(() => {
		if (query.data) {
			setTest(query.data);
		}
	}, [query.data, setTest]);

	return query;
}
