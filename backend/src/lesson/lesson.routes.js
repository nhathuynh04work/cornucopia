import { Router } from "express";
import { lessonController } from "./lesson.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	updateLessonProgressSchema,
	updateLessonSchema,
} from "./lesson.schema.js";

const router = Router();

router.use(authenticateJwt);

router.patch(
	"/:id",
	validate(updateLessonSchema),
	lessonController.updateLesson
);

router.post(
	"/:id/progress",
	validate(updateLessonProgressSchema),
	lessonController.updateLessonProgress
);

export default router;
