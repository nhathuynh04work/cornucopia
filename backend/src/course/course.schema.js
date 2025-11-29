import { z } from "zod";
import {
	CourseLevel,
	CourseStatus,
	LessonType,
} from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";
import { toArray } from "../utils/transform.js";

const CourseStatusSchema = z.enum(CourseStatus);

const CourseLevelSchema = z.enum(CourseLevel);

const LessonTypeSchema = z.enum(LessonType);

export const getCoursesSchema = z.object({
	query: z.object({
		search: z.string().optional(),
		sort: z
			.enum([
				"newest",
				"oldest",
				"price_asc",
				"price_desc",
				"rating",
				"popular",
			])
			.default("newest"),
		status: CourseStatusSchema.optional(),
		userId: z.coerce.number().int().optional(),
		enrolledUserId: z.coerce.number().int().optional(),
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).default(10),
		level: z.preprocess(toArray, z.array(z.string()).optional()),
		language: z.preprocess(toArray, z.array(z.string()).optional()),
		rating: z.coerce.number().min(0).max(5).optional(),
		price: z.enum(["all", "free", "paid"]).optional(),
	}),
});

const UpdateCourseBody = z
	.object({
		title: z.string().min(1, "Course title must be at least 1 character"),
		excerpt: z
			.string()
			.max(160, "Subtitle cannot exceed 160 characters")
			.nullish(),
		description: z.string().nullish(),
		price: z.coerce.number().min(0),
		coverUrl: z.string().nullish(),
		status: CourseStatusSchema,
		level: CourseLevelSchema.optional(),
		language: z.string().length(2).optional(),
	})
	.partial();

export const getCourseSchema = z.object({
	params: createIdParamSchema("courseId"),
});

export const updateCourseSchema = z.object({
	params: createIdParamSchema("courseId"),
	body: UpdateCourseBody,
});

export const deleteCourseSchema = z.object({
	params: createIdParamSchema("courseId"),
});

// --- Module Schemas ---

export const addModuleSchema = z.object({
	params: createIdParamSchema("courseId"),
	body: z.object({
		title: z.string().min(1, "Title is required"),
	}),
});

export const updateModuleSchema = z.object({
	params: createIdParamSchema("courseId").extend(
		createIdParamSchema("moduleId").shape
	),
	body: z.object({
		title: z.string().min(1, "Title is required"),
	}),
});

export const deleteModuleSchema = z.object({
	params: createIdParamSchema("courseId").extend(
		createIdParamSchema("moduleId").shape
	),
});

// --- Lesson Schemas ---

export const addLessonSchema = z.object({
	params: createIdParamSchema("courseId").extend(
		createIdParamSchema("moduleId").shape
	),
	body: z.object({
		title: z.string().min(1, "Title is required"),
		type: LessonTypeSchema.default(LessonType.VIDEO),
	}),
});

export const updateLessonSchema = z.object({
	params: createIdParamSchema("courseId")
		.extend(createIdParamSchema("moduleId").shape)
		.extend(createIdParamSchema("lessonId").shape),
	body: z
		.object({
			title: z.string().min(1),
			type: LessonTypeSchema,
			videoUrl: z.url().nullish().or(z.literal("")),
			htmlContent: z.string().nullish(),
			isPublished: z.boolean(),
		})
		.partial(),
});

export const deleteLessonSchema = z.object({
	params: createIdParamSchema("courseId")
		.extend(createIdParamSchema("moduleId").shape)
		.extend(createIdParamSchema("lessonId").shape),
});

// Update lesson progress
export const updateLessonProgressSchema = z.object({
	params: createIdParamSchema("courseId")
		.extend(createIdParamSchema("moduleId").shape)
		.extend(createIdParamSchema("lessonId").shape),
	body: z.object({
		isCompleted: z.boolean(),
	}),
});

// reviews
export const createReviewSchema = z.object({
	params: createIdParamSchema("courseId"),
	body: z.object({
		rating: z.number().int().min(1).max(5),
		content: z.string().optional(),
	}),
});

export const updateReviewSchema = z.object({
	params: createIdParamSchema("courseId").extend(
		createIdParamSchema("reviewId").shape
	),
	body: z.object({
		rating: z.number().int().min(1).max(5).optional(),
		content: z.string().optional(),
	}),
});

export const deleteReviewSchema = z.object({
	params: createIdParamSchema("courseId").extend(
		createIdParamSchema("reviewId").shape
	),
});
