import z from "zod";

export const UpdateOptionSchema = z.object({
	text: z.string().optional(),
	isCorrect: z.boolean().optional(),
});
