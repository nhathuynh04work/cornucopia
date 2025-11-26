import { z } from "zod";
import { TestItemType, TestStatus } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

export const getTestSchema = z.object({
	params: createIdParamSchema("id"),
});

export const deleteTestSchema = z.object({
	params: createIdParamSchema("id"),
});

const idSchema = z.number().int().positive();

const optionalIdSchema = z
	.union([idSchema, z.string()])
	.optional()
	.transform((val) => (typeof val === "number" ? val : undefined));

const answerOptionSchema = z.object({
	id: optionalIdSchema,
	text: z.string().optional().nullable(),
	isCorrect: z.boolean().default(false),
	sortOrder: z.number().int().optional(),
});

const mediaSchema = z.object({
	id: idSchema,
	url: z.url(),
});

const baseItemSchema = z.object({
	id: optionalIdSchema,
	type: z.enum(TestItemType),
	text: z.string().optional().nullable(),
	points: z.number().int().min(0).default(1),
	sortOrder: z.number().int().optional(),
	answer: z.string().optional().nullable(),

	answerOptions: z.array(answerOptionSchema).optional(),
	media: z.array(mediaSchema).optional(),
});

const testItemSchema = baseItemSchema.extend({
	children: z.lazy(() => z.array(baseItemSchema).optional()),
});

export const syncTestSchema = z.object({
	params: createIdParamSchema("id"),

	body: z.object({
		title: z.string().min(1, "Title is required"),
		description: z.string().optional().nullable(),
		status: z.enum(TestStatus).optional(),
		timeLimit: z.number().int().optional(),
		audioUrl: z.url().optional().nullable(),

		items: z.array(testItemSchema).default([]),
	}),
});
