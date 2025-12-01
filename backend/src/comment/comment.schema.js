import { z } from "zod";

export const createCommentSchema = z.object({
	body: z
		.object({
			content: z.string().min(1, "Nội dung không được để trống"),
			parentId: z.coerce.number().optional(),
			postId: z.coerce.number().optional(),
			lessonId: z.coerce.number().optional(),
			testId: z.coerce.number().optional(),
		})
		.refine(
			(data) => {
				const ids = [data.postId, data.lessonId, data.testId].filter(
					Boolean
				);
				return ids.length === 1; // Chỉ chấp nhận đúng 1 ID tồn tại
			},
			{
				message:
					"Chỉ được cung cấp một trong các ID: postId, lessonId hoặc testId",
				path: ["entityId"],
			}
		),
});
