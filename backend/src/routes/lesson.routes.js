import { Router } from "express";
import * as lessonController from "../controllers/lesson.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
	UpdateLessonProgressSchema,
	UpdateLessonSchema,
} from "../schemas/lesson.schema.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";

const router = Router();

router.use(authenticateJwt);

router.patch(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdateLessonSchema),
	lessonController.updateLesson
);

router.post(
	"/:id/progress",
	validateParams(["id"]),
	validateSchema(UpdateLessonProgressSchema),
	lessonController.updateLessonProgress
);

export default router;
