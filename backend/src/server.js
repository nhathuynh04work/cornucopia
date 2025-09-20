import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./routes/index.js";

const app = express();

// Middlewares
app.use(cors()); // To be configured later
app.use(express.json());

// Routes
app.use("/auth", authRouter);

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
