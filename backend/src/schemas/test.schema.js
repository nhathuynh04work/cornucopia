import { z } from "zod";

// Base shape used by both create & update
const TestBaseSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	timeLimit: z.number().int().nonnegative().optional(),
});

// For creating new tests (all required except optional fields)
export const CreateTestSchema = TestBaseSchema;

// For updating existing tests (partial update)
export const UpdateTestSchema = TestBaseSchema.partial().strict();
