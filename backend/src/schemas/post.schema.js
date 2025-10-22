import { z } from "zod";

const coverUrlSchema = z
  .string()
  .trim()
  .refine(
    (v) =>
      v === "" || // cho phép empty string (sẽ map thành null nếu muốn)
      /^https?:\/\//i.test(v) || // URL http/https
      /^data:image\/[a-z0-9.+-]+;base64,/i.test(v), // data URL
    { message: "coverUrl must be http(s) URL or data URL" }
  )
  .optional()
  .nullable();

//API tạo bài viết mới (POST /posts).
export const CreateDefaultPostSchema = z.object({
  // client có thể gửi topicIds hoặc topicId; coverUrl optional
  topicIds: z.array(z.coerce.number().int().positive()).optional(),
  coverUrl: coverUrlSchema,
});

//API cập nhật bài viết (PUT /posts/:id).
export const UpdatePostSchema = z
  .object({
    title: z.string().min(1),
    content: z.string().min(1),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    coverUrl: coverUrlSchema,
    topicIds: z.array(z.coerce.number().int().positive()).optional(),
  })
  .transform((body) => ({
    ...body,
    status: body.status?.toLowerCase?.() ?? "draft",
  }));

//API liệt kê bài viết (GET /posts?page=1&pageSize=30)
export const ListPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(30),
});
