import userApi from "@/apis/userApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, ...updates }) =>
			userApi.updateUser({ userId, data: updates }),
		onSuccess: () => {
			queryClient.invalidateQueries(["users"]);
		},
	});
}
