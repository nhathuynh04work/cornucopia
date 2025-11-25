import { Router } from "express";
import { courseController } from "./course.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import {
	addModuleSchema,
	deleteCourseSchema,
	getCourseSchema,
	updateCourseSchema,
} from "./course.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", courseController.getCourses);

router.get("/enrolled", courseController.getEnrolledCourses);

router.get("/my-courses", courseController.getMyCourses);

router.get(
	"/:id/info",
	validate(getCourseSchema),
	courseController.getCourseForInfoView
);

router.get(
	"/:id/edit",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(getCourseSchema),
	courseController.getCourseForEditor
);

router.get(
	"/:id/learn",
	validate(getCourseSchema),
	courseController.getCourseForLearning
);

router.get(
	"/:id/enrollment",
	validate(getCourseSchema),
	courseController.getUserCourseEnrollment
);

router.post(
	"/",
	requireRole(Role.ADMIN, Role.CREATOR),
	courseController.createCourse
);

router.patch(
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(updateCourseSchema),
	courseController.updateCourse
);

router.delete(
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(deleteCourseSchema),
	courseController.deleteCourse
);

router.post(
	"/:id/modules",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(addModuleSchema),
	courseController.addModule
);

export default router;
