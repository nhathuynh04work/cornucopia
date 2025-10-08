import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import {
	authRouter,
	sectionRouter,
	testRouter,
	uploadRouter,
	optionRouter,
	itemRouter,
  postRouter, 
  topicRouter,
  cardRouter,
  listRouter
} from "./routes/index.js";
import passport from "./config/passport.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: env.FRONTEND_URL || true,
    credentials: true,
  })
);

// tăng giới hạn body cho JSON & form
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Passport
app.use(passport.initialize());

// Routes
app.use("/auth", authRouter);
app.use("/lists", listRouter)
app.use("/cards", cardRouter);
app.use("/posts", postRouter);
app.use("/topics", topicRouter);
app.use("/upload", uploadRouter);
app.use("/tests", testRouter);
app.use("/sections", sectionRouter);
app.use("/items", itemRouter);
app.use("/options", optionRouter);

// Handler riêng cho payload quá lớn (413)
app.use((err, req, res, next) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "Payload too large" });
  }
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 400;
  res.status(status).json({ message: err.message || "Bad Request" });
});


app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
