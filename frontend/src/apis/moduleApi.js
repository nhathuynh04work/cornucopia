import { api } from "./axios";

export async function remove(moduleId) {
	await api.delete(`/modules/${moduleId}`);
}
