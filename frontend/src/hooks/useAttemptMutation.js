import { useMutation } from "@tanstack/react-query";
import attemptApi from "../apis/attemptApi";

export function useCreateAttemptMutation() {
	return useMutation({
		mutationFn: (payload) => attemptApi.create(payload),
	});
}