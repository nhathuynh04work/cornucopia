import testApi from "@/apis/testApi";
import { queryDefaults } from "@/lib/react-query.config";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useGetTests(params = {}) {
	return useQuery({
		queryKey: QUERY_KEYS.tests.list(params),
		queryFn: () => testApi.getAll(params),
		...queryDefaults,
	});
}

export function useGetAttemptedTests(params = {}) {
	return useQuery({
		queryKey: QUERY_KEYS.tests.attempted(params),
		queryFn: () => testApi.getAttemptedTests(params),
		...queryDefaults,
	});
}

export function useGetTestForInfo(id) {
	return useQuery({
		queryKey: QUERY_KEYS.tests.info(Number(id)),
		queryFn: () => testApi.getById(id),
		enabled: !!id,
		...queryDefaults,
	});
}

export function useGetTestForEdit(id) {
	return useQuery({
		queryKey: QUERY_KEYS.tests.edit(Number(id)),
		queryFn: () => testApi.getForEdit(id),
		enabled: !!id,
		...queryDefaults,
	});
}

export function useGetTestForAttempt(id) {
	return useQuery({
		queryKey: QUERY_KEYS.tests.attempt(Number(id)),
		queryFn: () => testApi.getForAttempt(id),
		enabled: !!id,
		...queryDefaults,
	});
}

export function useGetAttemptHistory(testId) {
	return useQuery({
		queryKey: QUERY_KEYS.tests.history(Number(testId)),
		queryFn: () => testApi.getAttemptHistory(testId),
		...queryDefaults,
	});
}
