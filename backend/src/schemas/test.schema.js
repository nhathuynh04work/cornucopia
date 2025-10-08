import { z } from "zod";

// Base shape used by both create & update
const testBaseSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	timeLimit: z.number().int().nonnegative().optional(),
	testType: z.enum(["quiz", "exam", "survey"]).optional(),
});

// For creating new tests (all required except optional fields)
export const createTestSchema = testBaseSchema;

// For updating existing tests (partial update)
export const updateTestSchema = testBaseSchema.partial().strict();
