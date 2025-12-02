import prisma from "../prisma.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";

const getSessionDetails = async (sessionId, userId) => {
	const id = parseInt(sessionId);

	const session = await prisma.studySession.findUnique({
		where: { id: id },
		include: {
			deck: {
				include: {
					cards: {
						orderBy: { id: "asc" },
					},
				},
			},
		},
	});

	if (!session) {
		throw new NotFoundError("Session not found");
	}

	if (session.userId !== userId) {
		throw new ForbiddenError("You do not have access to this session");
	}

	return session;
};

const submitAttempt = async ({ sessionId, userId, payload }) => {
	const session = await prisma.studySession.findUnique({
		where: { id: sessionId },
		select: { userId: true },
	});

	if (!session) throw new NotFoundError("Session not found");
	if (session.userId !== userId) throw new ForbiddenError("Access denied");

	return prisma.$transaction(async (tx) => {
		const attempt = await tx.cardAttempt.create({
			data: {
				sessionId: sessionId,
				cardId: payload.cardId,
				isCorrect: payload.isCorrect,
			},
		});

		await tx.studySession.update({
			where: { id: sessionId },
			data: { endTime: new Date() },
		});

		return attempt;
	});
};

const getSessionSummary = async (sessionId, userId) => {
	const id = parseInt(sessionId);

	const session = await prisma.studySession.findUnique({
		where: { id: id },
		include: {
			cardAttempts: {
				include: { card: true },
				orderBy: { createdAt: "desc" },
			},
			deck: {
				select: { title: true, _count: { select: { cards: true } } },
			},
		},
	});

	if (!session) throw new NotFoundError("Session not found");
	if (session.userId !== userId) throw new ForbiddenError("Access denied");

	const totalAttempts = session.cardAttempts.length;
	if (totalAttempts === 0) {
		return {
			deckTitle: session.deck.title,
			totalCards: session.deck._count.cards,
			accuracy: 0,
			correctCount: 0,
			incorrectCount: 0,
			durationSeconds: 0,
			masteredCards: [],
			reviewCards: [],
		};
	}

	const correctCount = session.cardAttempts.filter((a) => a.isCorrect).length;
	const incorrectCount = totalAttempts - correctCount;
	const accuracy = Math.round((correctCount / totalAttempts) * 100);

	const startTime = new Date(session.startTime);
	const endTime = session.endTime ? new Date(session.endTime) : new Date();
	const durationSeconds = Math.floor((endTime - startTime) / 1000);

	const cardStatusMap = new Map();

	for (const attempt of session.cardAttempts) {
		if (!cardStatusMap.has(attempt.cardId)) {
			cardStatusMap.set(attempt.cardId, {
				term: attempt.card.term,
				definition: attempt.card.definition,
				isMastered: attempt.isCorrect,
			});
		}
	}

	const masteredCards = [];
	const reviewCards = [];

	cardStatusMap.forEach((status) => {
		if (status.isMastered) {
			masteredCards.push(status);
		} else {
			reviewCards.push(status);
		}
	});

	return {
		deckTitle: session.deck.title,
		totalCards: session.deck._count.cards,
		accuracy,
		correctCount,
		incorrectCount,
		durationSeconds,
		masteredCards,
		reviewCards,
	};
};

export const sessionService = {
	getSessionDetails,
	submitAttempt,
	getSessionSummary,
};
