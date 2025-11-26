import { z } from "zod"; // Fixed import
import { LessonType } from "../generated/prisma/index.js";
import { ContentStatusSchema } from "../module/module.schema.js";
import { createIdParamSchema } from "../utils/validate.js";

const LessonTypeSchema = z.enum([LessonType.TEXT, LessonType.VIDEO]);

const UpdateLessonBody = z
	.object({
		title: z.string(),
		type: LessonTypeSchema.nullable(),
		textContent: z.string().nullable(),
		status: ContentStatusSchema,
	})
	.partial();

const UpdateLessonProgressBody = z.object({
	isCompleted: z.boolean(),
});

export const updateLessonSchema = z.object({
	params: createIdParamSchema("id"),
	body: UpdateLessonBody,
});

export const updateLessonProgressSchema = z.object({
	params: createIdParamSchema("id"),
	body: UpdateLessonProgressBody,
});
