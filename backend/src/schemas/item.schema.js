import z from "zod";

const TestItemTypeSchema = z.enum(["question", "group"]);
const QuestionTypeSchema = z.enum(["multiple_choice", "short_answer"]);

export const CreateItemSchema = z.object({
	sectionId: z.number(),
	type: TestItemTypeSchema,

	parentItemId: z.number().nullable().optional(),
	title: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
	mediaUrl: z.string().nullable().optional(),
	questionType: QuestionTypeSchema.nullable().optional(),
	points: z.number().nullable().optional(),
});

export const UpdateItemSchema = CreateItemSchema
	.partial()
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Update body cannot be empty.",
	}); // Best practice: ensure the update object isn't empty.
