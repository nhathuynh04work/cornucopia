import * as deckService from "../services/deck.service.js";

export async function getDecks(req, res) {
	const { search, sort, userId } = req.query;
	const currentUserId = req.user.id;

	const decks = await deckService.getDecks({
		search,
		sort,
		userId,
		currentUserId,
	});

	res.status(200).json({ decks });
}

export async function getDeckDetails(req, res) {
	const deckId = req.params.deckId;
	const deck = await deckService.getDeckDetails(deckId);

	res.status(200).json({ deck });
}

export async function createDeck(req, res) {
	const userId = req.user.id;
	const deck = await deckService.createDeck(userId);

	res.status(201).json({ deck });
}

export async function syncDeck(req, res) {
	const payload = req.body;
	const userId = req.user.id;
	const deckId = req.params.deckId;
	const deck = await deckService.syncDeck({ deckId, userId, payload });

	res.status(201).json({ deck });
}

export async function deleteDeck(req, res) {
	const userId = req.user.id;
	const deckId = req.params.deckId;
	await deckService.deleteDeck(deckId, userId);

	res.status(204).end();
}

export async function startSession(req, res) {
	const deckId = req.params.deckId;
	const userId = req.user.id;

	const session = await deckService.startSession(deckId, userId);
	res.status(201).json({ session });
}
