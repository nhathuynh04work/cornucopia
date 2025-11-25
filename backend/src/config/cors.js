import { env } from "./env.js";

export const corsConfig = {
	origin: env.FRONTEND_URL || true,
	credentials: true,
};
