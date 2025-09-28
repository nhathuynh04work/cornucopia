import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import passport from "./config/passport.js";
import { authRouter, postRouter, topicRouter } from "./routes/index.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: env.FRONTEND_URL || true,
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/topics", topicRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 400;
  res.status(status).json({ message: err.message || "Bad Request" });
});

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
