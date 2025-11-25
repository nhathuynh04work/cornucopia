import { deckService } from "./deck.service.js";

const getDecks = async (req, res) => {
	const { search, sort, userId } = req.query;
	const currentUserId = req.user.id;

	const decks = await deckService.getDecks({
		search,
		sort,
		userId,
		currentUserId,
	});

	res.status(200).json({ decks });
};

const getDeckDetails = async (req, res) => {
	const deckId = req.params.deckId;
	const deck = await deckService.getDeckDetails(deckId);

	res.status(200).json({ deck });
};

const createDeck = async (req, res) => {
	const userId = req.user.id;
	const deck = await deckService.createDeck(userId);

	res.status(201).json({ deck });
};

const syncDeck = async (req, res) => {
	const payload = req.body;
	const userId = req.user.id;
	const deckId = req.params.deckId;
	const deck = await deckService.syncDeck({ deckId, userId, payload });

	res.status(201).json({ deck });
};

const deleteDeck = async (req, res) => {
	const userId = req.user.id;
	const deckId = req.params.deckId;
	await deckService.deleteDeck(deckId, userId);

	res.status(204).end();
};

const startSession = async (req, res) => {
	const deckId = req.params.deckId;
	const userId = req.user.id;

	const session = await deckService.startSession(deckId, userId);
	res.status(201).json({ session });
};

export const deckController = {
	getDecks,
	getDeckDetails,
	createDeck,
	syncDeck,
	deleteDeck,
	startSession,
};
