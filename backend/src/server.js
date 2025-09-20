import express from "express";
import cors from "cors";
import { env } from "./config/env.js";

const app = express();

// To be configured later
app.use(cors());

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
