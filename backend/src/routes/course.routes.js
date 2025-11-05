import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
	CreateCourseSchema,
	UpdateCourseSchema,
} from "../schemas/course.schema.js";
import * as courseController from "../controllers/course.controller.js";
import { validateParams } from "../middlewares/validateParams.js";

const router = Router();

router.get("/", courseController.getCourses);

router.get(
	"/:id/public",
	validateParams(["id"]),
	courseController.getPublicCourseDetails
);

router.get(
	"/:id/edit",
	authenticateJWT,
	validateParams(["id"]),
	courseController.getCourseForEditor
);

router.get(
	"/:id/learn",
	authenticateJWT,
	validateParams(["id"]),
	courseController.getCourseForLearning
);

router.post(
	"/",
	authenticateJWT,
	validateSchema(CreateCourseSchema),
	courseController.createCourse
);

router.patch(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdateCourseSchema),
	courseController.updateCourse
);

router.post("/:id/modules", validateParams(["id"]), courseController.addModule);

export default router;
