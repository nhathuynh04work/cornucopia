import { api } from "./axios";

export async function createList(payload) {
	const { data } = await api.post("/lists", payload);

	return data.list;
}

export async function getListsOfUser() {
	const { data } = await api.get(`/lists`);
	return data.lists;
}

export async function getExploreLists() {
	const { data } = await api.get("/lists/explore");
	return data.lists;
}

export async function getListDetail(listId) {
	const { data } = await api.get(`/lists/${listId}`);
	return data.list;
}

export async function createCard({ listId, term, definition }) {
	const { data } = await api.post(`/lists/${listId}/cards`, {
		term,
		definition,
	});

	return data.card;
}

export async function updateCard(listId, cardId, term, definition) {
	const { data } = await api.put(`/lists/${listId}/cards/${cardId}`, {
		term,
		definition,
	});
	return data.card;
}

export async function deleteCard(cardId) {
	await api.delete(`/cards/${cardId}`);
}

export async function createCardsBulk({ listId, cardsArray }) {
	const { data } = await api.post(`/lists/${listId}/cards/bulk`, {
		cards: cardsArray,
	});

	return data.count;
}

export async function deleteList(listId) {
	await api.delete(`/lists/${listId}`);
}

export async function updateList({ listId, payload }) {
	const { data } = await api.put(`/lists/${listId}`, payload);
	return data.list;
}
