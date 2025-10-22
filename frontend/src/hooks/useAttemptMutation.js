import { useMutation } from "@tanstack/react-query";
import * as attemptApi from "../apis/attemptApi";

export function useCreateAttemptMutation() {
	return useMutation({
		mutationFn: (payload) => attemptApi.createAttempt(payload),
	});
}
