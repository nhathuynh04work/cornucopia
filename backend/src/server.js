import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { v1Router } from "./routes/v1.routes.js";
import passport from "./config/passport.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import getChatbotAnswer from "./chatbot/index.js";
import checkoutRouter from "./checkout/checkout.routes.js";
import { corsConfig } from "./config/cors.js";
import { initCronJobs } from "./cron/index.js";

export const app = express();

initCronJobs();

// Middlewares
app.use(cors(corsConfig));

app.use("/checkout", checkoutRouter);

app.use(express.json());

// Passport
app.use(passport.initialize());

// Routes
app.post("/chatbot", getChatbotAnswer);

app.use(v1Router);

// Error handler
app.use(errorHandler);

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
