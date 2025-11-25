import axios from "axios";
import { env } from "../env";
import { ACCESS_TOKEN_KEY } from "../lib/constants";

export const api = axios.create({
	baseURL: env.API_URL,
	timeout: 5000,
});

// Request interceptor: Attaches the JWT to every outgoing request
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log(error.response.data.error);
        
		if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
			throw new Error("Aborted");
		}
		const normalizedError = new Error(
			error.response?.data?.error || error.message || "Unknown error"
		);
		normalizedError.status = error.response?.status;
		throw normalizedError;
	}
);
