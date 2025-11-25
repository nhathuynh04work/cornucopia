import z from "zod";
import { TestItemMediaLayout, TestItemType } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

const ItemType = z.enum([TestItemType.MULTIPLE_CHOICE, TestItemType.SHORT_ANSWER, TestItemType.GROUP]);
const ItemMediaLayout = z.enum([TestItemMediaLayout.LEFT, TestItemMediaLayout.RIGHT, TestItemMediaLayout.TOP, TestItemMediaLayout.BOTTOM]);

export const CreateItemBody = z.object({
	type: ItemType,
	parentItemId: z.number().nullish(),
	title: z.string().nullish(),
	text: z.string().nullish(),
	points: z.number().nullish(),
	mediaLayout: ItemMediaLayout.nullish(),
});

const UpdateItemBody = CreateItemBody.partial()
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Update body cannot be empty.",
	});

export const updateItemSchema = {
	params: createIdParamSchema("id"),
	body: UpdateItemBody,
};

export const deleteItemSchema = {
	params: createIdParamSchema("id"),
};

export const addOptionSchema = {
	params: createIdParamSchema("id"),
};