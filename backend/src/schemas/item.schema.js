import z from "zod";
import {
	TestItemMediaLayout,
	TestItemType,
} from "../generated/prisma/index.js";

const ItemType = z.enum(TestItemType);
const ItemMediaLayout = z.enum(TestItemMediaLayout);

export const CreateItemSchema = z.object({
	type: ItemType,

	parentItemId: z.number().nullish(),
	title: z.string().nullish(),
	text: z.string().nullish(),
	points: z.number().nullish(),
	mediaLayout: ItemMediaLayout.nullish(),
});

export const UpdateItemSchema = CreateItemSchema.partial()
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Update body cannot be empty.",
	});
