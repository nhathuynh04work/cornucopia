import { z } from "zod";

export const createCommentSchema = z.object({
  body: z
    .object({
      content: z.string().min(1, "Nội dung không được để trống"),
      parentId: z.number().optional(),
      postId: z.number().optional(),
      lessonId: z.number().optional(),
      testId: z.number().optional(),
    })
    .refine(
      (data) => {
        const ids = [data.postId, data.lessonId, data.testId].filter(Boolean);
        return ids.length === 1; // Chỉ chấp nhận đúng 1 ID tồn tại
      },
      {
        message:
          "Chỉ được cung cấp một trong các ID: postId, lessonId hoặc testId",
        path: ["entityId"],
      }
    ),
});
