import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/lib/constants";
import userApi from "@/apis/userApi";
import { queryDefaults } from "@/lib/react-query.config";

export function useGetUsers({ role, search, page, limit = 10 }) {
	const { role: userRole } = useAuth();

	return useQuery({
		queryKey: ["users", { role, search, page, limit }],
		queryFn: () => userApi.getUsers({ role, search, page, limit }),
		keepPreviousData: true,
		enabled: userRole === Role.ADMIN,
	});
}

export function useGetLandingData() {
	return useQuery({
		queryKey: ["landing"],
		queryFn: userApi.getLandingData,
		...queryDefaults,
		staleTime: 1000 * 60 * 10,
	});
}

export function useGetDashboardData() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["/dashboard"],
		queryFn: userApi.getDashboardData,
		enabled: !!user,
	});
}

export function useGetLibrary() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["library"],
		queryFn: userApi.getLibrary,
		enabled: !!user,
		staleTime: 1000 * 60 * 2,
	});
}
