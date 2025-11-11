import * as ragService from "../services/rag.service.js";

/**
 * GET/POST /rag/chat
 * q, k, filters{ topicIds, topicSlugs }, llm?=0|1
 */
export async function chatController(req, res) {
  //Lấy câu hỏi q từ query string hoặc body
  const q = String(req.query.q ?? req.body?.q ?? req.body?.query ?? "").trim();
  //Lấy số lượng đoạn cần truy xuất k từ DB
  const k = Number(req.query.k ?? req.body?.k ?? 6) || 6;
  //Lọc theo chủ đề nếu có
  const filters = req.body?.filters ?? {};
  //Quyết định có dùng LLM (Gemini) để tóm tắt hay không
  const llmFlag = req.query?.llm ?? req.body?.llm;
  const useLLM = !(llmFlag === 0 || llmFlag === "0");

  const result = await ragService.chat(q, k, filters, { useLLM });
  return res.status(200).json(result);
}

/**
 * POST /rag/reindex
 * body: { postId: number, contentHtml: string }
 */
export async function reindexController(req, res, next) {
  const { postId, contentHtml } = req.body ?? {};
  await ragService.reindexPost(postId, contentHtml);
  return res.status(200).json({ ok: true });
}
