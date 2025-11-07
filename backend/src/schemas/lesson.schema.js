import z from "zod";
import { LessonType } from "../generated/prisma/index.js";
import { ContentStatusSchema } from "./module.schema.js";

const LessonTypeSchema = z.enum([LessonType.TEXT, LessonType.VIDEO]);

const LessonSchema = z.object({
	title: z.string(),
	type: LessonTypeSchema.nullable(),
	textContent: z.string().nullable(),
	status: ContentStatusSchema,
});

export const UpdateLessonSchema = LessonSchema.partial();

export const UpdateLessonProgressSchema = z.object({
	isCompleted: z.boolean(),
});
