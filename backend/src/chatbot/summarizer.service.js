import { cleanFragment } from "./utils.js";

let genAI = null;

/**
 * Khởi tạo client Gemini (nếu có key)
 */
async function getGeminiClient() {
  if (genAI) return genAI;

  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI;
  } catch (e) {
    console.error("❌ Gemini init failed:", e);
    return null;
  }
}

/**
 * Tóm tắt kết quả trả về bằng Gemini nếu có,
 * nếu không có → fallback trả bullet list.
 * @param {Array} hits - các đoạn văn bản (đã rerank)
 * @param {String} query - câu hỏi người dùng
 * @param {Object} opts - { useLLM?: boolean, model?: string }
 */
export async function summarize(hits, query, opts = {}) {
  // Không có hits → trả câu mặc định
  if (!Array.isArray(hits) || hits.length === 0) {
    return {
      answer:
        "Mình chưa thấy nội dung phù hợp trong Blog/Topic để trả lời câu này.",
      citations: [],
    };
  }

  // Chuẩn bị danh sách citation & nội dung tóm tắt
  const citations = hits.slice(0, 4).map((h) => ({
    postId: h.postId,
    title: h.title,
    slug: h.slug,
    snippet: cleanFragment(h.fragment || h.content || "").slice(0, 200),
    url: `/blog/${h.postId}`,
  }));

  // Nếu nội dung trích dẫn quá yếu → coi như không đủ thông tin
  const weak = citations.every((c) => (c.snippet || "").length < 25);
  if (weak) {
    return {
      answer:
        "Mình chưa thấy nội dung phù hợp trong Blog/Topic để trả lời câu này.",
      citations: [],
    };
  }
  // Nếu tắt LLM → chỉ trả bullets
  if (opts.useLLM === false || !process.env.GEMINI_API_KEY) {
    const bullets = citations.map(
      (c, i) => `• (${i + 1}) ${c.snippet || "Nội dung trích dẫn"}`
    );
    return { answer: bullets.join("\n\n"), citations };
  }

  // Nếu có key Gemini → dùng LLM để viết lại câu trả lời
  const genAI = await getGeminiClient();
  if (!genAI) {
    const bullets = citations.map(
      (c, i) => `• (${i + 1}) ${c.snippet || "Nội dung trích dẫn"}`
    );
    return { answer: bullets.join("\n\n"), citations };
  }

  try {
    // Model: lấy từ .env hoặc dùng mặc định
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    // Ghép ngữ cảnh để Gemini hiểu rõ
    const contextBullets = citations
      .map((c, i) => `(${i + 1}) ${c.snippet}`)
      .join("\n");

    const prompt = `
Bạn là trợ lý học tập AI. Trả lời ngắn gọn, đúng trọng tâm,
Câu hỏi: ${query}

Dưới đây là nội dung liên quan từ blog:
${contextBullets}

Hãy viết lại câu trả lời tự nhiên bằng tiếng Việt (2–5 câu), súc tích, không chèn HTML, không lặp lại nguyên văn.
Nếu câu hỏi đó không có liên quan đến trang blog, mà nó liên quan đến việc học ngoại ngữ thì hãy trả lời theo suy nghĩ của bạn, còn khác chủ đề thì hãy từ chối trả lời một cách lịch sự.
`;

    const response = await model.generateContent(prompt);
    const text =
      response?.response?.text?.() ||
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    if (text?.trim()) {
      return {
        answer: text.trim(),
        citations,
      };
    }

    // fallback khi text rỗng
    const bullets = citations.map(
      (c, i) => `• (${i + 1}) ${c.snippet || "Nội dung trích dẫn"}`
    );
    return { answer: bullets.join("\n\n"), citations };
  } catch (e) {
    console.error("⚠️ Gemini summarizer error:", e?.message || e);
    const bullets = citations.map(
      (c, i) => `• (${i + 1}) ${c.snippet || "Nội dung trích dẫn"}`
    );
    return { answer: bullets.join("\n\n"), citations };
  }
}
