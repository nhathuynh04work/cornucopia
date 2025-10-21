import { Router } from "express";
import {
  submitAnswerController,
  updateEndtimeController,
} from "../controllers/session.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { CreateAnswerSchema } from "../schemas/answer.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const router = Router();

router.post(
  "/:sessionId/answers",
  validateParams(["sessionId"]),
  validateSchema(CreateAnswerSchema),
  submitAnswerController
);
router.put("/updateEndtime", authenticateJWT, updateEndtimeController);

export default router;
