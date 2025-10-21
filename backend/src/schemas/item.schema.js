import z from "zod";
import { itemTypeEnum } from "../utils/constants.js";

const TestItemTypeSchema = z.enum(Object.values(itemTypeEnum));

export const CreateItemSchema = z.object({
	type: TestItemTypeSchema,

	parentItemId: z.number().nullable().optional(),
	title: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
	points: z.number().nullable().optional(),
});

export const UpdateItemSchema = CreateItemSchema.partial()
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Update body cannot be empty.",
	});
