import { api } from "./axios";

export async function getUsers(params) {
	const { data } = await api.get("/users", { params });
	return data; // { users, total, page, totalPages }
}

export async function updateInfo({ userId, payload }) {
	const { data } = await api.patch(`/users/${userId}`, payload);
	return data.user;
}

export async function updateRole({ userId, role }) {
	const { data } = await api.patch(`/users/${userId}/role`, { role });
	return data.user;
}
