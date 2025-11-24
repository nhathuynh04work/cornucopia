import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { requireRole } from "../middlewares/requireRole.js";
import { UpdateCourseSchema } from "../schemas/course.schema.js";
import * as courseController from "../controllers/course.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

router.get("/", courseController.getCourses);

router.get("/enrolled", authenticateJWT, courseController.getEnrolledCourses);

router.get("/my-courses", authenticateJWT, courseController.getMyCourses);

router.get(
	"/:id/info",
	validateParams(["id"]),
	courseController.getCourseForInfoView
);

router.get(
	"/:id/edit",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	courseController.getCourseForEditor
);

router.get(
	"/:id/learn",
	authenticateJWT,
	validateParams(["id"]),
	courseController.getCourseForLearning
);

router.get(
	"/:id/enrollment",
	authenticateJWT,
	validateParams(["id"]),
	courseController.getUserCourseEnrollment
);

router.post(
	"/",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	courseController.createCourse
);

router.patch(
	"/:id",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	validateSchema(UpdateCourseSchema),
	courseController.updateCourse
);

router.delete(
	"/:id",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	courseController.deleteCourse
);

router.post(
	"/:id/modules",
    authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	courseController.addModule
);

export default router;
