import { api } from "./axios";

export async function requestUploadUrl({ fileName, fileType }) {
	const { data } = await api.post("/media/upload-request", {
		fileName,
		fileType,
	});

	return data;
}

export async function setProperty({ entityType, entityId, url, duration }) {
	const { data } = await api.post("/media/set-property", {
		entityType,
		entityId,
		url,
		duration,
	});
	return data.url;
}

export async function linkMedia({ url, fileType, entityType, entityId }) {
	const { data } = await api.post("/media/link", {
		url,
		fileType,
		entityType,
		entityId,
	});

	return data.media;
}

export async function remove(id) {
	await api.delete(`/media/${id}`);
}
