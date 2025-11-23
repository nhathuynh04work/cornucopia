import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import * as userApi from "../apis/userApi";
import { Role } from "@/lib/constants";

export function useUsersQuery({ role, search, page, limit = 10 }) {
	const { role: userRole } = useAuth();

	return useQuery({
		queryKey: ["users", { role, search, page, limit }],
		queryFn: () => userApi.getUsers({ role, search, page, limit }),
		keepPreviousData: true,
		enabled: userRole === Role.ADMIN,
	});
}
