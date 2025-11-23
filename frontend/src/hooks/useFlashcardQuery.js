import {
	getDeckDetails,
	getExploreDecks,
	getMyDecks,
	getSessionDetails,
	getSessionSummary,
} from "@/apis/flashcardsApi";
import { useAuth } from "@/contexts/AuthContext";
import { queryDefaults } from "@/lib/react-query.config";
import { useQuery } from "@tanstack/react-query";

export function useGetMyDecks() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["decks"],
		queryFn: getMyDecks,
		...queryDefaults,
		enabled: !!user,
	});
}

export function useGetExploreDecks() {
	return useQuery({
		queryKey: ["decks", "explore"],
		queryFn: getExploreDecks,
		...queryDefaults,
	});
}

export function useGetDeckDetails(deckId) {
	return useQuery({
		queryKey: ["decks", Number(deckId)],
		queryFn: () => getDeckDetails(deckId),
		...queryDefaults,
	});
}

export function useGetSessionDetails(sessionId) {
	return useQuery({
		queryKey: ["session", sessionId],
		queryFn: () => getSessionDetails(sessionId),
		...queryDefaults,
		enabled: !!sessionId,
		retry: false,
	});
}

export function useGetSessionSummary(sessionId) {
	return useQuery({
		queryKey: ["session", sessionId, "summary"],
		queryFn: () => getSessionSummary(sessionId),
		...queryDefaults,
		enabled: !!sessionId,
	});
}
