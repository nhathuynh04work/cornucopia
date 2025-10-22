import z from "zod";
import { itemTypeEnum, mediaLayouts } from "../utils/constants.js";

const ItemType = z.enum(Object.values(itemTypeEnum));
const ItemMediaLayout = z.enum(Object.values(mediaLayouts));

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
