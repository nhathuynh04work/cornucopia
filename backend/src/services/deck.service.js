import prisma from "../prisma.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";

export async function getMyDecks(userId) {
	const decks = await prisma.deck.findMany({
		where: { userId: userId },
		include: {
			_count: { select: { cards: true } },
			user: true,
		},
	});

	return decks;
}

export async function getExploreDecks() {
	const decks = await prisma.deck.findMany({
		where: { isPublic: true },
		include: {
			_count: { select: { cards: true } },
			user: true,
		},
	});

	return decks;
}

export async function getDeckDetails(deckId) {
	const deck = await prisma.deck.findUnique({
		where: { id: deckId },
		include: {
			cards: {
				orderBy: { id: "asc" },
			},
			user: true,
		},
	});

	if (!deck) {
		throw new NotFoundError("Deck not found");
	}

	return deck;
}

export async function createDeck(userId) {
	const payload = {
		title: "New Deck",
		userId: userId,
		isPublic: false,
		cards: {
			create: [
				{ term: "Card 1", definition: "Definition of Card 1" },
				{ term: "Card 2", definition: "Definition of Card 2" },
			],
		},
	};

	const deck = await prisma.deck.create({ data: payload });

	return deck;
}

export async function syncDeck({ deckId, userId, payload }) {
	const deck = await prisma.deck.findUnique({
		where: { id: deckId },
	});

	if (!deck) {
		throw new NotFoundError("Deck not found");
	}

	if (deck.userId !== userId) {
		throw new ForbiddenError("You are not allowed to update this deck.");
	}

	const { cards, ...deckData } = payload;

	const cardsToCreate = [];
	const updatePromises = [];
	const incomingIds = [];

	for (const card of cards) {
		if (typeof card.id === "number") {
			incomingIds.push(card.id);

			updatePromises.push(
				prisma.card.update({
					where: { id: card.id },
					data: {
						term: card.term,
						definition: card.definition,
					},
				})
			);
		} else {
			cardsToCreate.push({
				term: card.term,
				definition: card.definition,
				deckId: deckId,
			});
		}
	}

	await prisma.$transaction([
		prisma.deck.update({
			where: { id: deckId },
			data: deckData,
		}),

		prisma.card.deleteMany({
			where: {
				deckId: deckId,
				id: { notIn: incomingIds },
			},
		}),

		...(cardsToCreate.length > 0
			? [prisma.card.createMany({ data: cardsToCreate })]
			: []),

		...updatePromises,
	]);

	return prisma.deck.findUnique({
		where: { id: deckId },
		include: {
			cards: {
				orderBy: { id: "asc" },
			},
		},
	});
}

export async function deleteDeck(deckId, userId) {
	const deck = await prisma.deck.findUnique({
		where: { id: deckId },
	});

	if (!deck) {
		throw new NotFoundError("Deck not found");
	}

	if (deck.userId !== userId) {
		throw new ForbiddenError("You are not allowed to delete this deck.");
	}

	await prisma.deck.delete({
		where: { id: deckId },
	});
}

export async function startSession(deckId, userId) {
	const deck = await prisma.deck.findUnique({
		where: { id: deckId },
	});

	if (!deck) {
		throw new NotFoundError("Deck not found");
	}

	const session = await prisma.studySession.create({
		data: { deckId: deckId, userId: userId },
	});

	return session;
}
