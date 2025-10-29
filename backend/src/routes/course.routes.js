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

router.get("/:id", validateParams(["id"]), courseController.getCourse);

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

export default router;
