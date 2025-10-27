import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { CreateCourseSchema } from "../schemas/course.schema.js";
import * as courseController from "../controllers/course.controller.js";

const router = Router();

router.post(
	"/",
	authenticateJWT,
	validateSchema(CreateCourseSchema),
	courseController.createCourse
);

export default router;
