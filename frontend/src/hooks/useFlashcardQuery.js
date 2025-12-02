import flashcardApi from "../apis/flashcardsApi";
import { queryDefaults } from "@/lib/react-query.config";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useGetDecks(params = {}) {
	return useQuery({
		queryKey: QUERY_KEYS.decks.list(params),
		queryFn: () => flashcardApi.getAll(params),
		...queryDefaults,
	});
}

export function useGetDeckDetails(deckId) {
	return useQuery({
		queryKey: QUERY_KEYS.decks.detail(Number(deckId)),
		queryFn: () => flashcardApi.getDeckDetails(deckId),
		...queryDefaults,
	});
}

export function useGetSessionDetails(sessionId) {
	return useQuery({
		queryKey: QUERY_KEYS.sessions.detail(sessionId),
		queryFn: () => flashcardApi.getSessionDetails(sessionId),
		...queryDefaults,
		enabled: !!sessionId,
		retry: false,
	});
}

export function useGetSessionSummary(sessionId) {
	return useQuery({
		queryKey: QUERY_KEYS.sessions.summary(sessionId),
		queryFn: () => flashcardApi.getSessionSummary(sessionId),
		...queryDefaults,
		enabled: !!sessionId,
	});
}
