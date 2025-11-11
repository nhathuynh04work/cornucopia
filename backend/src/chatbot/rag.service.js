import * as ragRepo from "./rag.repository.js";
import { splitText, stripHtml } from "./utils.js";
import { retrieve } from "./retriever.service.js";
import { miniRerank } from "./reranker.js";
import { summarize } from "./summarizer.service.js";

export async function reindexPost(postId, contentHtml, client) {
  const pid = Number(postId);
  if (!pid) throw new Error("postId invalid");

  const text = stripHtml(contentHtml || "");
  await ragRepo.deleteChunksByPost(pid, client);

  const pieces = splitText(text, 900);
  for (const c of pieces) await ragRepo.insertChunk(pid, c, client);
}

/** Trả về mảng hits có {postId, title, slug, content, fragment, score} */
export async function search(query, k = 6, filters = {}) {
  return retrieve(query, k, filters);
}

function shouldUseLLM(query) {
  const q = String(query || "");
  if (q.length < 8) return false;
  if (/[?]$/.test(q)) return true;
  return /(là gì|định nghĩa|tóm tắt|giải thích|phân biệt|so sánh|nên học|nên chọn|skimming|scanning)/i.test(
    q
  );
}

/** Chat pipeline: Retrieve → Rerank → Summarize */
export async function chat(query, k = 6, filters = {}, opts = {}) {
  const hits = await retrieve(query, k, filters);

  if (!hits.length) {
    return {
      answer:
        "Mình chưa thấy nội dung phù hợp trong Blog/Topic để trả lời câu này.",
      citations: [],
    };
  }

  // Lấy gợi ý chủ đề (nếu có)
  const topicHint =
    opts.topicHint ||
    (filters?.topicSlugs?.[0] ?? filters?.topicNames?.[0] ?? "");

  // Rerank các đoạn kết quả
  const ranked = miniRerank(hits, query, topicHint);

  const useLLMResolved =
    (opts.useLLM ?? shouldUseLLM(query)) && !!process.env.GEMINI_API_KEY;
  return summarize(ranked, query, { ...opts, useLLM: useLLMResolved });
}
