import flashcardApi from "../apis/flashcardsApi";
import { useAuth } from "@/contexts/AuthContext";
import { queryDefaults } from "@/lib/react-query.config";
import { useQuery } from "@tanstack/react-query";

export function useGetMyDecks() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["decks"],
		queryFn: flashcardApi.getMyDecks,
		...queryDefaults,
		enabled: !!user,
	});
}

export function useGetExploreDecks(params = {}) {
	return useQuery({
		queryKey: ["decks", "explore", params],
		queryFn: () => flashcardApi.getExploreDecks(params),
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
