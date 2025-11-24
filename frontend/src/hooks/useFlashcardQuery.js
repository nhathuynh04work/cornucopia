import flashcardApi from "../apis/flashcardsApi";
import { queryDefaults } from "@/lib/react-query.config";
import { useQuery } from "@tanstack/react-query";

export function useGetDecks(params = {}) {
	return useQuery({
		queryKey: ["decks", params],
		queryFn: () => flashcardApi.getAll(params),
		...queryDefaults,
	});
}

export function useGetDeckDetails(deckId) {
	return useQuery({
		queryKey: ["decks", Number(deckId)],
		queryFn: () => flashcardApi.getDeckDetails(deckId),
		...queryDefaults,
	});
}

export function useGetSessionDetails(sessionId) {
	return useQuery({
		queryKey: ["session", sessionId],
		queryFn: () => flashcardApi.getSessionDetails(sessionId),
		...queryDefaults,
		enabled: !!sessionId,
		retry: false,
	});
}

export function useGetSessionSummary(sessionId) {
	return useQuery({
		queryKey: ["session", sessionId, "summary"],
		queryFn: () => flashcardApi.getSessionSummary(sessionId),
		...queryDefaults,
		enabled: !!sessionId,
	});
}
