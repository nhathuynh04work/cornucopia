import { api } from "./axios";

export async function getMyDecks() {
	const { data } = await api.get("/decks");
	return data.decks;
}

export async function getExploreDecks() {
	const { data } = await api.get("/decks/explore");
	return data.decks;
}

export async function getDeckDetails(deckId) {
	const { data } = await api.get(`/decks/${deckId}`);
	return data.deck;
}

export async function createDeck() {
	// The backend creates a deck with default "New Deck" values, so no payload is needed
	const { data } = await api.post("/decks");
	return data.deck;
}

export async function syncDeck(deckId, payload) {
	// Payload structure expected by backend: { title, isPublic, cards: [...] }
	const { data } = await api.post(`/decks/${deckId}/sync`, payload);
	return data.deck;
}

export async function deleteDeck(deckId) {
	await api.delete(`/decks/${deckId}`);
}

export async function startSession(deckId) {
	const { data } = await api.post(`/decks/${deckId}/sessions`);
	return data.session;
}
