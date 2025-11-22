import { api } from "./axios";

export async function getAllTags() {
	const { data } = await api.get(`/tags`);
	return data.tags;
}
