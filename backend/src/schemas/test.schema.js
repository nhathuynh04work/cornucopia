import { z } from "zod";

export const CreateTestSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	timeLimit: z.number().int().nonnegative().nullable().optional(),
});

export const UpdateTestSchema = CreateTestSchema.partial();
