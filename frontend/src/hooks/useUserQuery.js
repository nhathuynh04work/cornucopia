import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/lib/constants";
import userApi from "@/apis/userApi";
import { queryDefaults } from "@/lib/react-query.config";

export function useGetUsers({ role, search, page, limit = 10, isBlocked }) {
	const { role: userRole } = useAuth();

	return useQuery({
		queryKey: ["users", { role, search, page, limit, isBlocked }],
		queryFn: () =>
			userApi.getUsers({ role, search, page, limit, isBlocked }),
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

export function useGetUserProfile(userId) {
	return useQuery({
		queryKey: ["profile", userId],
		queryFn: () => userApi.getUserProfile(userId),
		enabled: !!userId,
		...queryDefaults,
	});
}
