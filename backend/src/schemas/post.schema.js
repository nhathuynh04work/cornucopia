import { z } from "zod";
import { PostStatus } from "../generated/prisma/index.js";

const PostStatusSchema = z.enum(PostStatus);

export const UpdatePostSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
	excerpt: z.string().optional(),
	status: PostStatusSchema,
	tags: z.array(z.string()).optional(),
});

export const ListPostsQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(30),
});
