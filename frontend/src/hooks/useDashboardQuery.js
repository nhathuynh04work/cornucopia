import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { queryDefaults } from "@/lib/react-query.config";
import { Role } from "@/lib/constants";
import dashboardApi from "@/apis/dashboardApi";

export function useGetDashboardOverallStats() {
	const { user, role } = useAuth();

	return useQuery({
		queryKey: ["dashboard", "overall", user?.id, role],
		queryFn: () => dashboardApi.getOverallStats(role),
		enabled: !!user,
		...queryDefaults,
	});
}

export function useGetDashboardChartData({ chartType, timePeriod }) {
	const { user, role } = useAuth();

	const isEnabled =
		!!user && !!chartType && (role === Role.ADMIN || role === Role.CREATOR);

	return useQuery({
		queryKey: ["dashboard", "charts", role, chartType, timePeriod],
		queryFn: () =>
			dashboardApi.getChartData(role, { chartType, timePeriod }),
		enabled: isEnabled,
		...queryDefaults,
		staleTime: 1000 * 60 * 5,
	});
}
