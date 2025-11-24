import { api } from "./axios";

const flashcardsApi = {
	getAll: async (params) => {
		const { data } = await api.get("/decks", { params });
		return data.decks;
	},
	getDeckDetails: async (deckId) => {
		const { data } = await api.get(`/decks/${deckId}`);
		return data.deck;
	},
	createDeck: async () => {
		const { data } = await api.post("/decks");
		return data.deck;
	},
	syncDeck: async (deckId, payload) => {
		const { data } = await api.post(`/decks/${deckId}/sync`, payload);
		return data.deck;
	},
	deleteDeck: async (deckId) => {
		await api.delete(`/decks/${deckId}`);
	},
	startSession: async (deckId) => {
		const { data } = await api.post(`/decks/${deckId}/sessions`);
		return data.session;
	},
	getSessionDetails: async (sessionId) => {
		const { data } = await api.get(`/sessions/${sessionId}`);
		return data.session;
	},
	submitAttempt: async (sessionId, payload) => {
		const { data } = await api.post(
			`/sessions/${sessionId}/answers`,
			payload
		);
		return data.attempt;
	},
	getSessionSummary: async (sessionId) => {
		const { data } = await api.get(`/sessions/${sessionId}/summary`);
		return data.summary;
	},
};

export default flashcardsApi;
