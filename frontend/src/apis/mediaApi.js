import { api } from "./axios";

const mediaApi = {
	upload: async ({ file, onProgress }) => {
		const formData = new FormData();
		formData.append("file", file);

		const { data } = await api.post("/media/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
			timeout: 0, // No timeout for uploads
			onUploadProgress: (progressEvent) => {
				const percent = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				if (onProgress) onProgress(percent);
			},
		});
		return data;
	},
	remove: async (id) => {
		await api.delete(`/media/${id}`);
	},
};

export default mediaApi;
