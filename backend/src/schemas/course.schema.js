import z from "zod";
import { CourseStatus } from "../generated/prisma/index.js";

const CourseStatusSchema = z.enum(CourseStatus)

const CourseSchema = z.object({
	name: z.string().min(1, "Course name must be at least 1 character"),
	description: z.string().nullish(),
	price: z.coerce.number().positive(),
	coverUrl: z.string().nullish(),
	status: CourseStatusSchema,
});

export const CreateCourseSchema = CourseSchema.omit({
	coverUrl: true,
	status: true,
});

export const UpdateCourseSchema = CourseSchema.partial();
