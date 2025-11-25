import prisma from "../prisma.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";

const getDecks = async ({ search, sort, userId, currentUserId } = {}) => {
	const where = {};

	if (search) {
		where.title = {
			contains: search,
			mode: "insensitive",
		};
	}

	if (userId) {
		const targetId = parseInt(userId);
		where.userId = targetId;
		if (targetId !== currentUserId) {
			where.isPublic = true;
		}
	} else {
		where.isPublic = true;
	}

	let orderBy = {};
	switch (sort) {
		case "oldest":
			orderBy = { createdAt: "asc" };
			break;
		case "alphabetical":
			orderBy = { title: "asc" };
			break;
		case "newest":
		default:
			orderBy = { createdAt: "desc" };
			break;
	}

	return prisma.deck.findMany({
		where,
		orderBy,
		include: {
			_count: {
				select: { cards: true },
			},
			user: {
				select: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
		},
	});
};

const getDeckDetails = async (deckId) => {
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
};

const createDeck = async (userId) => {
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

	return prisma.deck.create({ data: payload });
};

const syncDeck = async ({ deckId, userId, payload }) => {
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
};

const deleteDeck = async (deckId, userId) => {
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
};

const startSession = async (deckId, userId) => {
	const deck = await prisma.deck.findUnique({
		where: { id: deckId },
	});

	if (!deck) {
		throw new NotFoundError("Deck not found");
	}

	return prisma.studySession.create({
		data: { deckId: deckId, userId: userId },
	});
};

export const deckService = {
	getDecks,
	getDeckDetails,
	createDeck,
	syncDeck,
	deleteDeck,
	startSession,
};
