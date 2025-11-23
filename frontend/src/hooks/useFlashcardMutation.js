import flashcardsApi from "@/apis/flashcardsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDeck() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: flashcardsApi.createDeck,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["decks"] });
		},
	});
}

export function useSyncDeck() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ deckId, payload }) =>
			flashcardsApi.syncDeck(deckId, payload),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["decks", Number(variables.deckId)],
			});

			queryClient.invalidateQueries({
				queryKey: ["decks"],
				exact: false,
			});
		},
	});
}

export function useDeleteDeck() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ deckId }) => flashcardsApi.deleteDeck(deckId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["decks"] });
		},
	});
}

export function useStartSession() {
	return useMutation({
		mutationFn: ({ deckId }) => flashcardsApi.startSession(deckId),
	});
}

export function useSubmitAttempt() {
	return useMutation({
		mutationFn: ({ sessionId, payload }) =>
			flashcardsApi.submitAttempt(sessionId, payload),
	});
}
