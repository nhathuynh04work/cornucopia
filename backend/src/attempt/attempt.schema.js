import z from "zod";
import { createIdParamSchema } from "../utils/validate.js";

const AnswerPayload = z.object({
	questionId: z.number(),
	text: z.string().nullish(),
	optionIds: z.array(z.number()),
});

const CreateAttemptBody = z.object({
	testId: z.number(),
	time: z.number(),
	answers: z.array(AnswerPayload),
});

export const createAttemptSchema = {
	body: CreateAttemptBody,
};

export const getAttemptResultSchema = {
	params: createIdParamSchema("id"),
};