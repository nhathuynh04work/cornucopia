import z from "zod";
import { createIdParamSchema } from "../utils/validate.js";

const UpdateOptionBody = z.object({
	text: z.string().optional(),
	isCorrect: z.boolean().optional(),
});

export const updateOptionSchema = {
	params: createIdParamSchema("id"),
	body: UpdateOptionBody,
};

export const deleteOptionSchema = {
	params: createIdParamSchema("id"),
};