import { api } from "./axios";

export async function deleteItem(id) {
	await api.delete(`/items/${id}`);
}

export async function updateItem(id, changes) {
	const { data } = await api.patch(`/items/${id}`, changes);
	return data.item;
}
