import { z } from "zod";

export const RagChatSchema = z.object({
  q: z.string().min(1).optional(),
  query: z.string().min(1).optional(),
  k: z.coerce.number().int().positive().max(20).optional(),
  llm: z.union([z.literal(0), z.literal(1)]).optional(),
  filters: z
    .object({
      topicIds: z.array(z.coerce.number().int().positive()).optional(),
      topicSlugs: z.array(z.string().min(1)).optional(),
      topicNames: z.array(z.string().min(1)).optional(),
      courseIds: z.array(z.coerce.number().int().positive()).optional(),
      courseNames: z.array(z.string().min(1)).optional(),
    })
    .optional(),
});

export const RagReindexSchema = z.object({
  postId: z.coerce.number().int().positive(),
  contentHtml: z.string().default(""),
});
