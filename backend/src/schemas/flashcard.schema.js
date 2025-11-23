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
