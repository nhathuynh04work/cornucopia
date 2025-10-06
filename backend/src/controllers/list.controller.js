import {
  createListService,
  getListInfoService,
  getListsOfUserService,
  deleteListService,
  createCardService,
} from "../services/list.service.js";

export async function createListController(req, res) {

  const { userId, title } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Khong co userId" });
  }

  if (Number.isNaN(Number(userId))) {
    return res.status(400).json({ error: "Id khong phai la so" });
  }

  try {
    const list = await createListService({ userId });

    res.status(201).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.error });
  }
}

export async function getListInfoController(req, res) {
  const { listId } = req.params;

  if (Number.isNaN(Number(listId))) {
    return res.status(400).json({ error: "List Id khong phai la so" });
  }

  try {
    const list = await getListInfoService({ listId });
    res.status(200).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.error });
  }
}

export async function getListsOfUserController(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Khong co userId" });
  }

  if (Number.isNaN(Number(userId))) {
    return res.status(400).json({ error: "Id khong phai la so" });
  }

  try {
    const lists = await getListsOfUserService({ userId });
    res.status(200).json({ lists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.error });
  }
}

export async function createCardController(req, res) {
  const { listId } = req.params;

  if (!listId) {
    return res.status(400).json({ error: "Khong co listId" });
  }

  if (Number.isNaN(Number(listId))) {
    return res.status(400).json({ error: "Id khong phai la so" });
  }

  try {
    const card = await createCardService({ listId });

    res.status(201).json({ card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.error });
  }
}

export async function deleteListController(req, res) {
  const {listId} = req.params;

  if(Number.isNaN(Number(listId))) {
    return res.status(400).json({ error: "Id khong phai la so"});
  }

  try {
    const list = await deleteListService({listId});
    res.status(200).json({list});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.error});
  }
}

