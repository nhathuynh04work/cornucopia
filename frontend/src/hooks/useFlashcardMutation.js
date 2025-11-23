import {
	createDeck,
	deleteDeck,
	startSession,
	submitAttempt,
	syncDeck,
} from "@/apis/flashcardsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDeck() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createDeck,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["decks"] });
		},
	});
}

export function useSyncDeck() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ deckId, payload }) => syncDeck(deckId, payload),
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
		mutationFn: ({ deckId }) => deleteDeck(deckId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["decks"] });
		},
	});
}

export function useStartSession() {
	return useMutation({
		mutationFn: ({ deckId }) => startSession(deckId),
	});
}

export function useSubmitAttempt() {
	return useMutation({
		mutationFn: ({ sessionId, payload }) =>
			submitAttempt(sessionId, payload),
	});
}
