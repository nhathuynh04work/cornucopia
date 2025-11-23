import z from "zod";

// Deck
const DeckBaseSchema = z.object({
	title: z.string().min(1, "Title is required"),
	isPublic: z.boolean().default(false),
});

export const UpdateDeckSchema = DeckBaseSchema.partial();

// Card
const CardBaseSchema = z.object({
	term: z.string().min(1, "Term cannot be empty"),
	definition: z.string().min(1, "Definition cannot be empty"),
});

// Sync
export const SyncDeckSchema = DeckBaseSchema.extend({
	cards: z.array(
		CardBaseSchema.extend({
			id: z.union([z.number(), z.string()]).optional(),
		})
	),
});

// Session Attempt
export const SubmitAttemptSchema = z.object({
	cardId: z.number({
		required_error: "Card ID is required",
		invalid_type_error: "Card ID must be a number",
	}),
	isCorrect: z.boolean({
		required_error: "isCorrect status is required",
		invalid_type_error: "isCorrect must be a boolean",
	}),
});
