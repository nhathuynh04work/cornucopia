import { listTopicsWithCount } from "../repositories/topic.repository.js";

export async function listTopicsController(req, res, next) {
  try {
    const topics = await listTopicsWithCount();
    res.json(topics);
  } catch (err) {
    next(err);
  }
}
