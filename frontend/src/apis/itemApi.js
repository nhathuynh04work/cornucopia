import { api } from "./axios";

export async function remove(id) {
	const { data } = await api.delete(`/items/${id}`);
	return data.test;
}

export async function update(id, changes) {
	const { data } = await api.patch(`/items/${id}`, changes);
	return data.test;
}

export async function addOption(id) {
	const { data } = await api.post(`items/${id}/options`);
	return data.test;
}
