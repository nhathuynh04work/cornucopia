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

export function useAttemptedTests() {
	return useQuery({
		queryKey: ["tests", "attempted"],
		queryFn: testApi.fetchAttemptedTests,
	});
}

export function useMyTests() {
	return useQuery({
		queryKey: ["tests", "admin"],
		queryFn: testApi.fetchMyTests,
	});
}

export function useTestLiteQuery(id) {
	const numericId = Number(id);

	return useQuery({
		queryKey: ["test", numericId, "info"],
		queryFn: () => testApi.fetchTestBasicInfo(numericId),
		enabled: !!numericId,
	});
}

export function useTestEditorQuery(id) {
	const setTest = useTestEditorStore((s) => s.setTest);
	const numericId = Number(id);

	const query = useQuery({
		queryKey: ["test", numericId, "edit"],
		queryFn: () => testApi.fetchTestDetails(numericId),
		enabled: !!numericId,
	});

	// Hydrate store when query resolves
	useEffect(() => {
		if (query.data) {
			console.log(query.data.status);
			setTest(query.data);
		}
	}, [query.data, setTest]);

	return query;
}

export function useTestAttemptQuery(id) {
	const numericId = Number(id);

	const setTest = useTestAttemptStore((s) => s.setTest);

	const query = useQuery({
		queryKey: ["test", numericId, "attempt"],
		queryFn: () => testApi.fetchTestForAttempt(numericId),
		enabled: !!numericId,
	});

	useEffect(() => {
		if (query.data) {
			setTest(query.data);
		}
	}, [query.data, setTest]);

	return query;
}

export function useTestAttemptsHistoryQuery(testId) {
	const numericTestId = Number(testId);

	return useQuery({
		queryKey: ["attempts-history", numericTestId],
		queryFn: () => testApi.fetchTestAttemptsHistory(numericTestId),
		enabled: !!numericTestId,
	});
}
