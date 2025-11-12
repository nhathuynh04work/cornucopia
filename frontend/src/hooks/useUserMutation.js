import { updateRole } from "@/apis/userApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, role }) => updateRole({ userId, role }),
		onSuccess: () => {
			queryClient.invalidateQueries(["users"]);
		},
	});
}
