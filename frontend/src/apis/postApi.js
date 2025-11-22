import { api } from "./axios";

export async function getAllPosts() {
	const { data } = await api.get(`/posts`);
	return data.posts;
}

export async function getMyPosts() {
	const { data } = await api.get(`/posts/my`);
	return data.posts;
}

export async function createPost(payload) {
	const { data } = await api.post("/posts", payload);
	return data.post;
}

export async function updatePost(postId, payload) {
	const { data } = await api.put(`/posts/${postId}`, payload);
	return data.post;
}

export async function deletePost(postId) {
	await api.delete(`/posts/${postId}`);
}

export async function getPostDetails(postId) {
	const { data } = await api.get(`/posts/${postId}`);
	return data.post;
}
