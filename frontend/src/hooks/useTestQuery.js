import testApi from "@/apis/testApi";
import { queryDefaults } from "@/lib/react-query.config";
import { useQuery } from "@tanstack/react-query";

export function useGetTests(params = {}) {
	return useQuery({
		queryKey: ["tests", params],
		queryFn: () => testApi.getAll(params),
		...queryDefaults,
	});
}

export function useGetTestForInfo(id) {
	return useQuery({
		queryKey: ["test", Number(id), "info"],
		queryFn: () => testApi.getById(id),
		enabled: !!id,
		...queryDefaults,
	});
}

export function useGetTestForEdit(id) {
	return useQuery({
		queryKey: ["test", Number(id), "edit"],
		queryFn: () => testApi.getForEdit(id),
		enabled: !!id,
		...queryDefaults,
	});
}

export function useGetTestForAttempt(id) {
	return useQuery({
		queryKey: ["test", Number(id), "attempt"],
		queryFn: () => testApi.getForAttempt(id),
		enabled: !!id,
		...queryDefaults,
	});
}

export function useGetAttemptHistory(testId) {
	return useQuery({
		queryKey: ["attempts-history", Number(testId)],
		queryFn: () => testApi.getAttemptHistory(testId),
		...queryDefaults,
	});
}
