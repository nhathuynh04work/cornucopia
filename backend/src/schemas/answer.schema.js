import z from "zod";

export const CreateAnswerSchema = z.object({
    flashcardId: z.number(),
    needRevise: z.boolean(),
})