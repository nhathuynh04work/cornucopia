import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/lib/constants";
import userApi from "@/apis/userApi";

export function useGetUsers({ role, search, page, limit = 10 }) {
	const { role: userRole } = useAuth();

	return useQuery({
		queryKey: ["users", { role, search, page, limit }],
		queryFn: () => userApi.getUsers({ role, search, page, limit }),
		keepPreviousData: true,
		enabled: userRole === Role.ADMIN,
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
