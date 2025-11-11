import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const preferredModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";

// danh sách fallback: 2.0-flash -> 2.5-flash -> 1.5-flash-002 -> 1.5-pro-002
const FALLBACK_MODELS = [
  preferredModel,
  "gemini-2.5-flash",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro-002",
];
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/** Build prompt gọn, có context bullets */
function toPrompt(query, contextBullets = []) {
  const ctx = contextBullets.filter(Boolean).join("\n- ");
  const guide =
    "Bạn là trợ lý trích rút từ blog. Trả lời ngắn gọn, đúng trọng tâm. " +
    "Nếu context không phù hợp với câu hỏi, nói rõ 'không tìm thấy trong Blog/Topic'. (đừng bịa).";
  return [
    guide,
    `Câu hỏi: ${query}`,
    ctx ? `Context:\n- ${ctx}` : "",
    "Yêu cầu: Trả lời 2–5 câu, tiếng Việt, không chèn thẻ HTML.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Gọi 1 model với retry/backoff nhẹ (đỡ 429) */
async function callOnce(modelId, prompt, attempt = 0) {
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  });

  try {
    const resp = await model.generateContent(prompt);
    const text =
      resp?.response?.text?.() ||
      resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";
    if (!text.trim()) throw new Error("Empty response");
    return text;
  } catch (err) {
    // 404: model không tồn tại với API version / sai tên
    const msg = err?.message || String(err);
    const code = err?.status || err?.statusCode;
    if (code === 404 || /not found|is not supported/i.test(msg)) {
      throw Object.assign(new Error(`MODEL_404 ${modelId}`), { fatal: true });
    }
    // 429: quota/rate limit → backoff ngắn rồi thử lại
    if (code === 429 || /Resource exhausted|Too Many Requests/i.test(msg)) {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 800));
        return callOnce(modelId, prompt, attempt + 1);
      }
    }
    throw err;
  }
}

/** Hỏi Gemini (có cache, fallback) */
export async function askGemini(query, contextBullets = []) {
  if (!apiKey || !genAI) throw new Error("Missing GEMINI_API_KEY");
  const prompt = toPrompt(query, contextBullets);

  const cacheKey =
    opts.cacheKey ||
    `gem:${preferredModel}:${query}:${contextBullets.join("|").slice(0, 512)}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const errors = [];
  for (const m of FALLBACK_MODELS) {
    try {
      const text = await callOnce(m, prompt);
      setCache(cacheKey, out);
      return { text, model: m };
    } catch (e) {
      errors.push(`${m}: ${e.message}`);
      // nếu là fatal 404 thì chuyển ngay model khác, không retry thêm
      continue;
    }
  }
  throw new Error(`[Gemini failed] ${errors.join(" | ")}`);
}
