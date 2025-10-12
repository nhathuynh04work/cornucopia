import z from "zod";

const itemBaseSchema = z.object({
	sectionId: z.number(),
	type: z.string(),
	text: z.string(),
	questionType: z.string(),
	points: z.number(),
	sortOrder: z.number(),
});

export const updateItemSchema = itemBaseSchema.partial().strict();
