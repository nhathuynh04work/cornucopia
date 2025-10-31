import { Router } from "express";
import * as lessonController from "../controllers/lesson.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { UpdateLessonSchema } from "../schemas/lesson.schema.js";

const router = Router();

router.patch(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdateLessonSchema),
	lessonController.updateLesson
);

export default router;
