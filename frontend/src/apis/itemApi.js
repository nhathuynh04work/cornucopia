import { api } from "./axios";

export async function deleteItem(id) {
	await api.delete(`/items/${id}`);
}
