import { z } from "zod";
import {
	CourseLevel,
	CourseStatus,
	LessonType,
} from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

const CourseStatusSchema = z.enum(CourseStatus);

const CourseLevelSchema = z.enum(CourseLevel);

const LessonTypeSchema = z.enum(LessonType);

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
	params: createIdParamSchema("id"),
});

export const updateCourseSchema = z.object({
	params: createIdParamSchema("id"),
	body: UpdateCourseBody,
});

export const deleteCourseSchema = z.object({
	params: createIdParamSchema("id"),
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
