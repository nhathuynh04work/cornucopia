import * as listService from "../services/list.service.js";

export async function createList(req, res) {
  const { title } = req.body;
  const userId = req.user.id;

  const list = await listService.createList({ userId, title });

  res.status(201).json({ list });
}

export async function getListInfo(req, res) {
  const listId = req.params.listId;

  const list = await listService.getListInfo(listId);
  res.status(200).json({ list });
}

export async function getListsOfUser(req, res) {
  const userId = req.user.id;

  const lists = await listService.getListsOfUser(userId);
  res.status(200).json({ lists });
}

export async function createCard(req, res) {
  const listId = req.params.listId;
  const card = await listService.createCard({ listId, ...req.body });
  res.status(201).json({ card });
}

export async function updateCard(req, res) {
  const cardId = req.params.cardId;

  const card = await listService.updateCard(cardId, req.body);
  res.status(200).json({ card });
}

export async function deleteList(req, res) {
  const listId = req.params.listId;

  await listService.deleteList(listId);
  res.status(204).end();
}

export async function updateList(req, res) {
  const listId = req.params.listId;

  const list = await listService.updateList(listId, req.body);
  res.status(200).json({ list });
}

export async function startSession(req, res) {
  const listId = req.params.listId;
  const userId = req.user.id;

  const session = await listService.startSession(listId, userId);
  res.status(201).json({ session });
}

export async function createCardsBulk(req, res) {
  const listId = req.params.listId;
  const cards = req.body.cards;
  const result = await listService.createCardsBulk(listId, cards);
  res.status(201).json({
    count: result.count,
  });
}
