// services/rag/retriever.service.js
import * as ragRepo from "../../repositories/rag.repository.js";
import { tokenize } from "./tokenizer.js";

export async function retrieve(query, k = 6, filters = {}) {
  const q = String(query || "").trim();
  if (!q) return [];

  const limit = Math.min(20, Math.max(1, k));
  const tokens = tokenize(q);

  // resolve topicIds
  let topicIds = Array.isArray(filters.topicIds) ? filters.topicIds : [];
  if (
    !topicIds?.length &&
    Array.isArray(filters.topicSlugs) &&
    filters.topicSlugs.length
  ) {
    topicIds = await ragRepo.findTopicIdsBySlugs(filters.topicSlugs);
  }
  if (!topicIds?.length && tokens.length) {
    topicIds = await ragRepo.findTopicIdsByTokens(tokens);
  }

  // 1) FT chính
  let rows = await ragRepo.searchChunksFT(q, limit, topicIds);
  if (rows.length) return rows;

  // 2) FT OR (nới lỏng)
  if (tokens.length >= 2) {
    rows = await ragRepo.searchChunksFT_OR(tokens, limit, topicIds);
    if (rows.length) return rows;
  }

  // 3) ILIKE fallback (>=2 token)
  if (tokens.length >= 2) {
    const patterns = tokens.map((t) => `%${t}%`);
    rows = await ragRepo.searchChunksILIKE(patterns, limit, topicIds);
    if (rows.length) return rows;
  }

  return [];
}
