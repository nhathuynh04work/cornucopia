import { useQuery } from "@tanstack/react-query";
import * as testApi from "../apis/testApi";
import { useTestEditorStore } from "../store/testEditorStore.js";
import { useEffect } from "react";
import { useTestAttemptStore } from "@/store/testAttemptStore";
import { useAuth } from "@/contexts/AuthContext";

export function useTestsQuery() {
	return useQuery({
		queryKey: ["tests"],
		queryFn: testApi.getTests,
	});
}

export function useAttemptedTests() {
	return useQuery({
		queryKey: ["tests", "attempted"],
		queryFn: testApi.getAttemptedTests,
	});
}

export function useMyTests() {
	return useQuery({
		queryKey: ["tests", "admin"],
		queryFn: testApi.getMyTests,
	});
}

export function useTestInfoQuery(id) {
	const numericId = Number(id);

	return useQuery({
		queryKey: ["test", numericId, "info"],
		queryFn: () => testApi.getTestForInfoView(numericId),
		enabled: !!numericId,
	});
}

export function useTestEditQuery(id) {
	const setTest = useTestEditorStore((s) => s.setTest);
	const numericId = Number(id);

	const query = useQuery({
		queryKey: ["test", numericId, "edit"],
		queryFn: () => testApi.getTestForEdit(numericId),
		enabled: !!numericId,
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
	const numericId = Number(id);

	const setTest = useTestAttemptStore((s) => s.setTest);

	const query = useQuery({
		queryKey: ["test", numericId, "attempt"],
		queryFn: () => testApi.getTestForAttempt(numericId),
		enabled: !!numericId,
	});

	useEffect(() => {
		if (query.data) {
			setTest(query.data);
		}
	}, [query.data, setTest]);

	return query;
}

export function useAttemptHistoryQuery(testId) {
	const { user } = useAuth();
	const numericTestId = Number(testId);

	return useQuery({
		queryKey: ["attempts-history", numericTestId],
		queryFn: () => testApi.getAttemptHistory(numericTestId),
		enabled: !!numericTestId && !!user,
	});
}
