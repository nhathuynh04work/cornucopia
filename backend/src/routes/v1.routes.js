import authRouter from "../auth/auth.routes.js";
import deckRouter from "../deck/deck.routes.js";
import postRouter from "../post/post.routes.js";
import tagRouter from "../tag/tag.routes.js";
import mediaRouter from "../media/media.routes.js";
import testRouter from "../test/test.routes.js";
import sessionRouter from "../session/session.routes.js";
import userRouter from "../user/user.routes.js";
import attemptRouter from "../attempt/attempt.routes.js";
import courseRouter from "../course/course.routes.js";
import dashboardRouter from "../dashboard/dashboard.routes.js";
import commentRouter from "../comment/comment.routes.js";
import { Router } from "express";

export const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/decks", deckRouter);
v1Router.use("/posts", postRouter);
v1Router.use("/tags", tagRouter);
v1Router.use("/media", mediaRouter);
v1Router.use("/tests", testRouter);
v1Router.use("/sessions", sessionRouter);
v1Router.use("/users", userRouter);
v1Router.use("/attempts", attemptRouter);
v1Router.use("/courses", courseRouter);
v1Router.use("/dashboard", dashboardRouter);
v1Router.use("/comments", commentRouter);
