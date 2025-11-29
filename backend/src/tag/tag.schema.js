import { z } from "zod";
import { createIdParamSchema } from "../utils/validate.js";

export const deleteTagSchema = z.object({
	params: createIdParamSchema("id"),
});

export const getTagsSchema = z.object({
	query: z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
		search: z.string().optional(),
	}),
});
