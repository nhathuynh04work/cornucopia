import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as listApi from "@/apis/listApi";
import toast from "react-hot-toast";

export function useCreateList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload) => listApi.createList(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lists"] });
		},
		onError: () => toast.error("Không thể tạo danh sách."),
	});
}
