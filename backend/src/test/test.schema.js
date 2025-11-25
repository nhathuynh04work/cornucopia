import { z } from "zod";
import { TestStatus } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";
import { CreateItemBody } from "../item/item.schema.js";

const TestStatusSchema = z.enum([TestStatus.DRAFT, TestStatus.PUBLIC, TestStatus.ARCHIVED]);

const UpdateTestBody = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	timeLimit: z.number().int().nonnegative(),
	status: TestStatusSchema,
}).partial();

export const getTestSchema = {
	params: createIdParamSchema("id"),
};

export const updateTestSchema = {
	params: createIdParamSchema("id"),
	body: UpdateTestBody,
};

export const deleteTestSchema = {
	params: createIdParamSchema("id"),
};

export const addItemSchema = {
	params: createIdParamSchema("id"),
	body: CreateItemBody,
};