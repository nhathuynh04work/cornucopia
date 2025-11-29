import { api } from "./axios";

const postApi = {
	getAll: async (params) => {
		const { data } = await api.get(`/posts`, { params });
		return data;
	},
	create: async (payload) => {
		const { data } = await api.post("/posts", payload);
		return data.post;
	},
	update: async (postId, payload) => {
		const { data } = await api.put(`/posts/${postId}`, payload);
		return data.post;
	},
	delete: async (postId) => {
		await api.delete(`/posts/${postId}`);
	},
	getDetails: async (postId) => {
		const { data } = await api.get(`/posts/${postId}`);
		return data.post;
	},
};

export default postApi;
