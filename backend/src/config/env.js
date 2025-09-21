import { config } from "dotenv";

config();

export const env = {
	PORT: process.env.PORT,
	FRONTEND_URL: process.env.FRONTEND_URL,
	DB_CONNECTION_STRING: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASS: process.env.SMTP_PASS,
	FROM_EMAIL: process.env.FROM_EMAIL,
	APP_BASE_URL: process.env.APP_BASE_URL,
};
