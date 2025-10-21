import z from "zod";

export const CreateCardSchema = z.object({
    term: z.string(),
    definition: z.string(),
});

export const UpdateCardSchema = CreateCardSchema;