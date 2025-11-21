import { z } from "zod";
import { TestStatus } from "../generated/prisma/index.js";

const TestStatusSchema = z.enum(TestStatus);

const TestSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	timeLimit: z.number().int().nonnegative(),
	status: TestStatusSchema,
});

export const CreateTestSchema = TestSchema.omit({
	status: true,
	timeLimit: true,
});

export const UpdateTestSchema = TestSchema.partial();
