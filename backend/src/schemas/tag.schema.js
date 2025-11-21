import { z } from "zod";

export const CreateTagSchema = z.object({
	name: z.string().min(1, "Tag name is required"),
});

export const ListTagPostsQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(30),
});
