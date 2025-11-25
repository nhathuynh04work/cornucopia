import z from "zod";
import { CourseStatus } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

const CourseStatusSchema = z.enum([
	CourseStatus.DRAFT,
	CourseStatus.PUBLIC,
	CourseStatus.ARCHIVED,
]);

const UpdateCourseBody = z
	.object({
		name: z.string().min(1, "Course name must be at least 1 character"),
		description: z.string().nullish(),
		price: z.coerce.number().positive(),
		coverUrl: z.string().nullish(),
		status: CourseStatusSchema,
	})
	.partial();

export const getCourseSchema = {
	params: createIdParamSchema("id"),
};

export const updateCourseSchema = {
	params: createIdParamSchema("id"),
	body: UpdateCourseBody,
};

export const deleteCourseSchema = {
	params: createIdParamSchema("id"),
};

export const addModuleSchema = {
	params: createIdParamSchema("id"),
};

