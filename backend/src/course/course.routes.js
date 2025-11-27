import { Router } from "express";
import { courseController } from "./course.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import {
	addLessonSchema,
	addModuleSchema,
	deleteCourseSchema,
	deleteLessonSchema,
	deleteModuleSchema,
	getCourseSchema,
	updateCourseSchema,
	updateLessonSchema,
	updateModuleSchema,
} from "./course.schema.js";

const router = Router();

router.use(authenticateJwt);

// --- READ OPERATIONS ---
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

// --- COURSE OPERATIONS ---
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

// --- MODULE OPERATIONS ---

// Add Module to Course
router.post(
	"/:courseId/modules",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(addModuleSchema),
	courseController.addModule
);

// Update Module
router.patch(
	"/:courseId/modules/:moduleId",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(updateModuleSchema),
	courseController.updateModule
);

// Delete Module
router.delete(
	"/:courseId/modules/:moduleId",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(deleteModuleSchema),
	courseController.deleteModule
);

// --- LESSON OPERATIONS ---

// Add Lesson to Module
router.post(
	"/:courseId/modules/:moduleId/lessons",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(addLessonSchema),
	courseController.addLesson
);

// Update Lesson
router.patch(
	"/:courseId/modules/:moduleId/lessons/:lessonId",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(updateLessonSchema),
	courseController.updateLesson
);

// Delete Lesson
router.delete(
	"/:courseId/modules/:moduleId/lessons/:lessonId",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(deleteLessonSchema),
	courseController.deleteLesson
);

export default router;
