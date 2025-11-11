import { Router } from "express";
import { chatController, reindexController } from "./rag.controller.js";
import { ipLimiter } from "../middlewares/ipLimiter.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { RagChatSchema, RagReindexSchema } from "./rag.schema.js";

const router = Router();
router.post("/chat", ipLimiter, validateSchema(RagChatSchema), chatController);
router.get("/chat", ipLimiter, chatController);
router.post("/reindex", validateSchema(RagReindexSchema), reindexController);
export default router;
