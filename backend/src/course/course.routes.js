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
	createReviewSchema,
	deleteCourseSchema,
	deleteLessonSchema,
	deleteModuleSchema,
	deleteReviewSchema,
	getCourseSchema,
	getCoursesSchema,
	updateCourseSchema,
	updateLessonProgressSchema,
	updateLessonSchema,
	updateModuleSchema,
	updateReviewSchema,
} from "./course.schema.js";

const router = Router();

router.use(authenticateJwt);

// --- READ OPERATIONS ---
router.get("/", validate(getCoursesSchema), courseController.getCourses);

router.get(
	"/:courseId/info",
	validate(getCourseSchema),
	courseController.getCourseForInfoView
);

router.get(
	"/:courseId/edit",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(getCourseSchema),
	courseController.getCourseForEditor
);

router.get(
	"/:courseId/learn",
	validate(getCourseSchema),
	courseController.getCourseForLearning
);

router.get(
	"/:courseId/enrollment",
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
	"/:courseId",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(updateCourseSchema),
	courseController.updateCourse
);

router.delete(
	"/:courseId",
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

// Update lesson progress
router.put(
	"/:courseId/modules/:moduleId/lessons/:lessonId/progress",
	validate(updateLessonProgressSchema),
	courseController.updateLessonProgress
);

// Reviews
router.get(
	"/:courseId/reviews",
	validate(getCourseSchema),
	courseController.getReviews
);

router.post(
	"/:courseId/reviews",
	validate(createReviewSchema),
	courseController.addReview
);

router.patch(
	"/:courseId/reviews/:reviewId",
	validate(updateReviewSchema),
	courseController.updateReview
);

router.delete(
	"/:courseId/reviews/:reviewId",
	validate(deleteReviewSchema),
	courseController.deleteReview
);

export default router;
