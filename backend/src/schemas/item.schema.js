import z from "zod";

const TestItemTypeSchema = z.enum(["PASSAGE", "QUESTION", "INSTRUCTION"]);
const QuestionTypeSchema = z.enum([
	"MULTIPLE_CHOICE",
	"SHORT_ANSWER",
	"TRUE_FALSE",
]);

export const createItemSchema = z.object({
	sectionId: z.number(),
	type: TestItemTypeSchema,

	parentItemId: z.number().nullable().optional(),
	title: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
	mediaUrl: z.string().nullable().optional(),
	questionType: QuestionTypeSchema.nullable().optional(),
	points: z.number().nullable().optional(),
});

export const updateItemSchema = createItemSchema
	.partial()
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Update body cannot be empty.",
	}); // Best practice: ensure the update object isn't empty.
