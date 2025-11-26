import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { queryDefaults } from "@/lib/react-query.config";
import testApi from "@/apis/testApi.js";

export function useGetTests(params = {}) {
	return useQuery({
		queryKey: ["tests", params],
		queryFn: () => {
			if (params.scope === "ATTEMPTED") {
				return testApi.getAttempted(params);
			}

			return testApi.getAll(params);
		},
		...queryDefaults,
	});
}

export function useGetTestForInfo(id) {
	const numericId = Number(id);

	return useQuery({
		queryKey: ["test", numericId, "info"],
		queryFn: () => testApi.getForInfoView(numericId),
		enabled: !!numericId,
		...queryDefaults,
	});
}

export function useGetTestForEdit(id) {
	const numericId = Number(id);

	return useQuery({
		queryKey: ["test", numericId, "edit"],
		queryFn: () => testApi.getForEdit(numericId),
		enabled: !!numericId,
		refetchOnMount: "always",
		...queryDefaults,
	});
}

export function useGetTestForAttempt(testId) {
	return useQuery({
		queryKey: ["test", Number(testId), "attempt"],
		queryFn: () => testApi.getForAttempt(testId),
		enabled: !!testId,
		...queryDefaults,
	});
}

export function useGetAttemptHistory(testId) {
	const { user } = useAuth();
	const numericTestId = Number(testId);

	return useQuery({
		queryKey: ["attempts-history", numericTestId],
		queryFn: () => testApi.getAttemptHistory(numericTestId),
		enabled: !!numericTestId && !!user,
		...queryDefaults,
	});
}
