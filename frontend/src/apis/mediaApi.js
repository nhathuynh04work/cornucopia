import { api } from "./axios";

const mediaApi = {
	requestUploadUrl: async ({ fileName, fileType }) => {
		const { data } = await api.post("/media/upload-request", {
			fileName,
			fileType,
		});
		return data;
	},
	setProperty: async ({ entityType, entityId, url, duration }) => {
		const { data } = await api.post("/media/set-property", {
			entityType,
			entityId,
			url,
			duration,
		});
		return data.url;
	},
	linkMedia: async ({ url, fileType, entityType, entityId }) => {
		const { data } = await api.post("/media/link", {
			url,
			fileType,
			entityType,
			entityId,
		});
		return data.media;
	},
	remove: async (id) => {
		await api.delete(`/media/${id}`);
	},
};

export default mediaApi;