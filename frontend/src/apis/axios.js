import axios from "axios";
import { env } from "../env";

export const api = axios.create({
	baseURL: env.API_URL,
	timeout: 5000,
});

// response interceptor
api.interceptors.response.use(
	(response) => response, 
	(error) => {
		const normalizedError = new Error(
			error.response?.data?.error || error.message || "Unknown error"
		);
		normalizedError.status = error.response?.status;
		throw normalizedError;
	}
);
