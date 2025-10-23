import z from "zod";

const AnswerPayloadSchema = z.object({
	questionId: z.number(),
	text: z.string().nullish(),
	optionIds: z.array(z.number()),
});

export const CreateAttemptSchema = z.object({
	testId: z.number(),
	time: z.number(),
	answers: z.array(AnswerPayloadSchema),
});

export const GetAttemptsSchema = z.object({
	testId: z.number().positive(),
	userId: z.number().positive(),
});
