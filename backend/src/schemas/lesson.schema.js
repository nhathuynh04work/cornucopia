import z from "zod";
import { LessonType } from "../generated/prisma/index.js";

const LessonTypeSchema = z.enum([LessonType.TEXT, LessonType.VIDEO]);

const LessonSchema = z.object({
	title: z.string(),
	type: LessonTypeSchema.nullable(),
	textContent: z.string().nullable(),
});

export const UpdateLessonSchema = LessonSchema.partial();

export const UpdateLessonProgressSchema = z.object({
	isCompleted: z.boolean(),
});
