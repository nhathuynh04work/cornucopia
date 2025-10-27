import z from "zod";

const CourseSchema = z.object({
	name: z.string().min(1, "Course name must be at least 1 character"),
	description: z.string().nullish(),
	price: z.coerce.number().positive(),
	coverUrl: z.string().nullish(),
});

export const CreateCourseSchema = CourseSchema.omit({ coverUrl: true });

export const UpdateCourseSchema = CourseSchema;
