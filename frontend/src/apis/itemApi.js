import { api } from "./axios";

export async function remove(id) {
	const { data } = await api.delete(`/items/${id}`);
	return data.section;
}

export async function update(id, changes) {
	const { data } = await api.patch(`/items/${id}`, changes);
	return data.section;
}
