import { api } from "./axios";

export async function requestUploadUrl({ fileName, fileType }) {
	const { data } = await api.post("/media/upload-request", {
		fileName,
		fileType,
	});

	return data; // { key, uploadUrl }
}

export async function setMediaProperty(payload) {
	console.log(payload);
	await api.post("/media/set-property", payload);
}

export async function linkMedia({ s3Key, fileType, entityType, entityId }) {
	const { data } = await api.post("/media/link", {
		s3Key,
		fileType,
		entityType,
		entityId,
	});

	return data.test;
}

export async function getSignedViewUrl(key) {
	const { data } = await api.get("/media/view-url", {
		params: { key },
	});

	return data.fetchUrl;
}

export async function remove(id) {
	const { data } = await api.delete(`/media/${id}`);
	return data.test;
}
