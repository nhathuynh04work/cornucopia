import z from "zod";
import { createIdParamSchema } from "../utils/validate.js";

const DeckBase = z.object({
	title: z.string().min(1, "Title is required"),
	isPublic: z.boolean().default(false),
});

const CardBase = z.object({
	term: z.string().min(1, "Term cannot be empty"),
	definition: z.string().optional(),
});

const SyncDeckBody = DeckBase.extend({
	cards: z.array(
		CardBase.extend({
			id: z.union([z.number(), z.string()]).optional(),
		})
	),
});

const SubmitAttemptBody = z.object({
	cardId: z.number({
		required_error: "Card ID is required",
		invalid_type_error: "Card ID must be a number",
	}),
	isCorrect: z.boolean({
		required_error: "isCorrect status is required",
		invalid_type_error: "isCorrect must be a boolean",
	}),
});

export const getDeckSchema = z.object({
	params: createIdParamSchema("deckId"),
});

export const createDeckSchema = z.object({});

export const syncDeckSchema = z.object({
	params: createIdParamSchema("deckId"),
	body: SyncDeckBody,
});

export const deleteDeckSchema = z.object({
	params: createIdParamSchema("deckId"),
});

export const startSessionSchema = z.object({
	params: createIdParamSchema("deckId"),
});

export const getSessionSchema = z.object({
	params: createIdParamSchema("sessionId"),
});

export const submitAttemptRouteSchema = z.object({
	params: createIdParamSchema("sessionId"),
	body: SubmitAttemptBody,
});
