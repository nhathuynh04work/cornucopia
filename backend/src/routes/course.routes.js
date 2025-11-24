import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { requireRole } from "../middlewares/requireRole.js";
import { UpdateCourseSchema } from "../schemas/course.schema.js";
import * as courseController from "../controllers/course.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { Role } from "../generated/prisma/index.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", courseController.getCourses);

router.get("/enrolled", courseController.getEnrolledCourses);

router.get("/my-courses", courseController.getMyCourses);

router.get(
	"/:id/info",
	validateParams(["id"]),
	courseController.getCourseForInfoView
);

router.get(
	"/:id/edit",
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	courseController.getCourseForEditor
);

router.get(
	"/:id/learn",
	validateParams(["id"]),
	courseController.getCourseForLearning
);

router.get(
	"/:id/enrollment",
	validateParams(["id"]),
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
	validateParams(["id"]),
	validateSchema(UpdateCourseSchema),
	courseController.updateCourse
);

router.delete(
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	courseController.deleteCourse
);

router.post(
	"/:id/modules",
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	courseController.addModule
);

export default router;
