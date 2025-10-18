import { api } from "./axios";

export async function deleteOption(id) {
	const { data } = await api.delete(`/options/${id}`);
	return data.section;
}
