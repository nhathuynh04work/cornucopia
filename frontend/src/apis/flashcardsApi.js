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
	const { data } = await api.post("/decks");
	return data.deck;
}

export async function syncDeck(deckId, payload) {
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

export async function getSessionDetails(sessionId) {
	const { data } = await api.get(`/sessions/${sessionId}`);
	return data.session;
}

export async function submitAttempt(sessionId, payload) {
	const { data } = await api.post(`/sessions/${sessionId}/answers`, payload);
	return data.attempt;
}

export async function getSessionSummary(sessionId) {
	const { data } = await api.get(`/sessions/${sessionId}/summary`);
	return data.summary;
}
