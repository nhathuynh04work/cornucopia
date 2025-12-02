import { z } from "zod";
import { PostStatus } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";
import { toArray } from "../utils/transform.js";

const PostStatusSchema = z.enum([PostStatus.DRAFT, PostStatus.PUBLIC]);

const UpdatePostBody = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverUrl: z.url().nullish().or(z.literal("")),
  status: PostStatusSchema,
  tags: z.array(z.string()).optional(),
});

const ListPostsQuery = z.object({
  search: z.string().optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  status: PostStatusSchema.optional(),
  authorId: z.coerce.number().int().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  tags: z.preprocess(toArray, z.array(z.string()).optional()),
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
