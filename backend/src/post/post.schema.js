import { z } from "zod";
import { PostStatus } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

const PostStatusSchema = z.enum([PostStatus.DRAFT, PostStatus.PUBLIC]); 

const UpdatePostBody = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
	excerpt: z.string().optional(),
	status: PostStatusSchema,
	tags: z.array(z.string()).optional(),
});

const ListPostsQuery = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(30),
});

export const getPostSchema = z.object({
	params: createIdParamSchema("id"),
});

export const updatePostSchema = z.object({
	params: createIdParamSchema("id"),
	body: UpdatePostBody,
});

export const deletePostSchema = z.object({
	params: createIdParamSchema("id"),
});

export const listPostsSchema = z.object({
	query: ListPostsQuery,
});
