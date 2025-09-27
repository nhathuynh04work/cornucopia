import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter, testRouter, uploadRouter } from "./routes/index.js";
import passport from "./config/passport.js";
import initDB from "./db/initDB.js";

const app = express();

// init database connection
await initDB();

// Middlewares
app.use(cors()); // To be configured later
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/tests", testRouter);

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
