import z from "zod";

export const CreateListSchema = z.object({
  title: z.string(),
});

export const UpdateListSchema = CreateListSchema;
