import prisma from "../prisma.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { mapToContentLanguage } from "../utils/transform.js";

const updateDeckCounts = async (deckId) => {
	const [cardsCount, studySessionCount] = await Promise.all([
		prisma.card.count({ where: { deckId } }),
		prisma.studySession.count({ where: { deckId } }),
	]);

	await prisma.deck.update({
		where: { id: deckId },
		data: { cardsCount, studySessionCount },
	});
};

const getDecks = async ({
	search,
	sort,
	userId,
	currentUserId,
	page = 1,
	limit = 10,
	level,
	language,
} = {}) => {
	const where = {};

	if (search) {
		where.title = {
			contains: search,
			mode: "insensitive",
		};
	}

	if (userId) {
		const targetId = userId;
		where.userId = targetId;
		if (targetId !== currentUserId) {
			where.isPublic = true;
		}
	} else {
		where.isPublic = true;
	}

	if (level && level.length > 0 && !level.includes("ALL_LEVELS")) {
		where.level = { in: level };
	}

	if (language && language.length > 0) {
		where.language = { in: mapToContentLanguage(language) };
	}

	let orderBy = {};
	switch (sort) {
		case "oldest":
			orderBy = { createdAt: "asc" };
			break;
		case "alphabetical":
			orderBy = { title: "asc" };
			break;
		case "popularity":
			orderBy = { studySessionCount: "desc" };
			break;
		case "newest":
		default:
			orderBy = { createdAt: "desc" };
			break;
	}

	const skip = (page - 1) * limit;

	const [decks, totalItems] = await Promise.all([
		prisma.deck.findMany({
			where,
			orderBy,
			skip,
			take: limit,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				},
			},
		}),
		prisma.deck.count({ where }),
	]);

	return {
		data: decks,
		pagination: {
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
			currentPage: page,
		},
	};
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
		cardsCount: 2,
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

	await updateDeckCounts(deckId);

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

	const session = await prisma.studySession.create({
		data: { deckId: deckId, userId: userId },
	});

	await updateDeckCounts(deckId);

	return session;
};

export const deckService = {
	getDecks,
	getDeckDetails,
	createDeck,
	syncDeck,
	deleteDeck,
	startSession,
};
