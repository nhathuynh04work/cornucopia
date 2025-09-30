import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import {
	authRouter,
	sectionRouter,
	testRouter,
	uploadRouter,
	questionRouter,
	groupRouter,
	optionRouter,
} from "./routes/index.js";
import passport from "./config/passport.js";

const app = express();

// Middlewares
app.use(cors()); // To be configured later
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/tests", testRouter);
app.use("/sections", sectionRouter);
app.use("/groups", groupRouter);
app.use("/questions", questionRouter);
app.use("/options", optionRouter);

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
