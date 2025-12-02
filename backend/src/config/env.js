import { config } from "dotenv";

config();

export const env = {
	API_URL: process.env.API_URL,
	PORT: process.env.PORT,
	FRONTEND_URL: process.env.FRONTEND_URL,
	DB_CONNECTION_STRING: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
	DB_URL: process.env.DATABASE_URL,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASS: process.env.SMTP_PASS,
	FROM_EMAIL: process.env.FROM_EMAIL,
	APP_BASE_URL: process.env.APP_BASE_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	AWS_REGION: process.env.AWS_REGION,
	S3_BUCKET: process.env.S3_BUCKET,
	BUCKET_URL: process.env.S3_BUCKET_URL,
	STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
	STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};
