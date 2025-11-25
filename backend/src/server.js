import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import {
	authRouter,
	testRouter,
	optionRouter,
	itemRouter,
	postRouter,
	sessionRouter,
	userRouter,
	mediaRouter,
	attemptRouter,
	courseRouter,
	moduleRouter,
	lessonRouter,
	checkoutRouter,
	tagRouter,
	deckRouter,
	dashboardRouter,
} from "./routes/index.js";
import passport from "./config/passport.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import getChatbotAnswer from "./chatbot/index.js";

const app = express();

// Middlewares
app.use(
	cors({
		origin: env.FRONTEND_URL || true,
		credentials: true,
	})
);

app.use("/checkout", checkoutRouter);

app.use(express.json());

// Passport
app.use(passport.initialize());

// Routes
app.post("/chatbot", getChatbotAnswer);
app.use("/auth", authRouter);
app.use("/decks", deckRouter);
app.use("/posts", postRouter);
app.use("/tags", tagRouter);
app.use("/media", mediaRouter);
app.use("/tests", testRouter);
app.use("/items", itemRouter);
app.use("/options", optionRouter);
app.use("/sessions", sessionRouter);
app.use("/users", userRouter);
app.use("/attempts", attemptRouter);
app.use("/courses", courseRouter);
app.use("/modules", moduleRouter);
app.use("/lessons", lessonRouter);
app.use("/dashboard", dashboardRouter);

// Error handler
app.use(errorHandler);

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
