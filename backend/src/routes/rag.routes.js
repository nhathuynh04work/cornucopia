import { Router } from "express";
import {
  chatController,
  reindexController,
} from "../controllers/rag.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { RagChatSchema, RagReindexSchema } from "../schemas/rag.schema.js";
import { ipLimiter } from "../middlewares/ipLimiter.js";

const router = Router();
router.post("/chat", ipLimiter, validateSchema(RagChatSchema), chatController);
router.get("/chat", ipLimiter, chatController);
router.post("/reindex", validateSchema(RagReindexSchema), reindexController);
export default router;
