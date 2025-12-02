import { defineConfig } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
	datasource: {
		url: process.env.DB_URL,
	},
	seed: {
		command: "node prisma/seed.js",
	},
});
