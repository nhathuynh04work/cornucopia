import { config } from "dotenv";

config();

export const env = {
	PORT: process.env.PORT,
	FRONTEND_URL: process.env.FRONTEND_URL,
};
