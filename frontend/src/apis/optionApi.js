import { api } from "./axios";

export async function update(id, changes) {
	const { data } = await api.patch(`/options/${id}`, changes);
	return data.section;
}

export async function remove(id) {
	const { data } = await api.delete(`/options/${id}`);
	return data.section;
}
