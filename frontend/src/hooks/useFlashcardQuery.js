import {
	getDeckDetails,
	getExploreDecks,
	getMyDecks,
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
