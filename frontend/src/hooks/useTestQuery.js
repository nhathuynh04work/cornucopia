import { useQuery } from "@tanstack/react-query";
import * as testApi from "../apis/testApi";
import { useTestEditorStore } from "../store/testEditorStore.js";
import { useEffect } from "react";
import { useTestAttemptStore } from "@/store/testAttemptStore";

export function useTestsQuery() {
	return useQuery({
		queryKey: ["tests"],
		queryFn: testApi.fetchTests,
	});
}

export function useTestLiteQuery(id) {
	return useQuery({
		queryKey: ["tests", id, "lite"],
		queryFn: () => testApi.fetchTestBasicInfo(id),
	});
}

export function useTestEditorQuery(id) {
	const setTest = useTestEditorStore((s) => s.setTest);

	const query = useQuery({
		queryKey: ["tests", id, "full"],
		queryFn: () => testApi.fetchTestDetails(id),
	});

	// Hydrate store when query resolves
	useEffect(() => {
		if (query.data) {
			setTest(query.data);
		}
	}, [query.data, setTest]);

	return query;
}

export function useTestAttemptQuery(id) {
	const setTest = useTestAttemptStore((s) => s.setTest);

	const query = useQuery({
		queryKey: ["tests", id, "attempt"],
		queryFn: () => testApi.fetchTestForAttempt(id),
	});

	useEffect(() => {
		if (query.data) {
			setTest(query.data);
		}
	}, [query.data, setTest]);

	return query;
}
