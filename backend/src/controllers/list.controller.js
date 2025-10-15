import {
  createListService,
  getListInfoService,
  getListsOfUserService,
  deleteListService,
  createCardService,
  updateListService,
  updateCardService,
  startSessionService,
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
    const list = await createListService({ userId, title });

    res.status(201).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.error });
  }
}

export async function getListInfoController(req, res) {
  const listId = Number(req.params.listId);

  if (Number.isNaN(listId)) {
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
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: "Khong co userId" });
  }

  if (Number.isNaN(userId)) {
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
  const listId = Number(req.params.listId);
  const { term, definition } = req.body;

  console.log("📥 Dữ liệu nhận từ frontend:", { listId, term, definition });

  if (!listId) {
    return res.status(400).json({ error: "Khong co listId" });
  }

  if (Number.isNaN(listId)) {
    return res.status(400).json({ error: "Id khong phai la so" });
  }

  try {
    const card = await createCardService({ listId, term, definition });

    res.status(201).json({ card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.error });
  }
}

export async function updateCardController(req, res) {
  const cardId = Number(req.params.cardId);
  const {term, definition} = req.body;

  if (!cardId) {
    return res.status(400).json({ error: "Khong co cardId" });
  }

  if(Number.isNaN(cardId)) {
    return res.status(400),json({ error: "Id khong phai la so"});
  }

  try {
    const card = await updateCardService({ cardId, term, definition});
    res.status(200).json({card});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.error});
  }
}

export async function deleteListController(req, res) {
  const listId = Number(req.params.listId);

  if (Number.isNaN(listId)) {
    return res.status(400).json({ error: "Id khong phai la so" });
  }

  try {
    const list = await deleteListService({ listId });
    res.status(200).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.error });
  }
}

export async function updateListController(req, res) {
  const listId = Number(req.params.listId);
  const { title } = req.body;

  if (!listId) {
    return res.status(400).json({ error: "Khong co listId" });
  }

  if (Number.isNaN(listId)) {
    return res.status(400).json({ error: "Id khong phai la so" });
  }

  try {
    const list = await updateListService({ listId, title });
    res.status(200).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.error });
  }
}

export async function startSessionController(req, res) {
  try {
    const { listId } = req.params;
    const { userId } = req.body;

    if (!listId || !userId) {
      return res.status(400).json({ message: "Thiếu listId hoặc userId" });
    }

    const session = await startSessionService({
      listId: Number(listId),
      userId: Number(userId),
    });

    res.status(201).json({
      message: "Đã bắt đầu session học mới",
      session,
    });
  } catch (error) {
    console.error("Lỗi tạo session:", error);
    res.status(500).json({
      message: "Không thể tạo session",
      error: error.message,
    });
  }
}
