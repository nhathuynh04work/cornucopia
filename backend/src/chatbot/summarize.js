import { getSnippet } from "./utils.js";
import { getAiClient } from "./aiClient.js";
import { defaults } from "../utils/constants.js";

// Dedupe citations theo (type + url + title)
function dedupeCitations(citations = []) {
  const seen = new Set();
  const out = [];

  for (const c of citations) {
    const key = `${c.type || "unknown"}|${c.url || ""}|${c.title || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }

  return out;
}

// return text response from AI model and citations for related content
export async function summarize(hits, query) {
  // no hits => default answer
  if (!hits.length) return defaults.CHATBOT_ANSWER;

  // build raw citations
  let citations = hits
    .map((h) => getCitationItem(h))
    // bỏ citation quá yếu (snippet quá ngắn)
    .filter((c) => !isWeakCitation(c))
    // bỏ citation không có url (không click được)
    .filter((c) => !!c.url && !!c.title && !!c.snippet);

  // dedupe & giới hạn số lượng
  citations = dedupeCitations(citations).slice(0, 6);

  // rewrite answer using Gemini
  const genAI = await getAiClient();
  if (!genAI) return { answer: getBulletContextList(citations), citations };

  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const contextBullets = getBulletContextList(citations);
    const prompt = `
                        Bạn là trợ lý học tập AI của web Cornucopia. Trả lời ngắn gọn, đúng trọng tâm,
                        Câu hỏi: ${query}

                        Dưới đây là nội dung liên quan từ Cornucopia Blog, Courses và Test:
                        ${contextBullets}

                        Hãy viết lại câu trả lời tự nhiên bằng tiếng Việt (2–5 câu), súc tích, không chèn HTML, không lặp lại nguyên văn.
                        Nếu câu hỏi đó không có liên quan đến trang blog, course và test mà nó liên quan đến việc học ngoại ngữ thì hãy trả lời theo suy nghĩ của bạn, còn khác chủ đề thì hãy từ chối trả lời một cách lịch sự.
                        `;

    const res = await model.generateContent(prompt);
    const text = res.response.text().trim();

    return {
      answer: text ? text : getBulletContextList(citations),
      citations,
    };
  } catch (e) {
    console.error("Gemini summarizer error:", e);
    return { answer: getBulletContextList(citations), citations };
  }
}

function getCitationItem(data) {
  const snippet = getSnippet(data.content || data.fragment || "");
  const baseTitle = data.title || "(Tài liệu tham khảo)";

  const result = {
    title: baseTitle,
    snippet,
    type: "other",
    url: undefined,
  };

  if (data.source === "course") {
    result.type = "course";
    result.url = `/courses/${data.courseId}`;
  } else if (data.source === "post") {
    result.type = "post";
    result.url = `/posts/${data.postId}`;
  } else if (data.source === "test") {
    result.type = "test";
    result.url = `/tests/${data.testId ?? data.id}`;
  }

  return result;
}

function getBulletContextList(citations) {
  return citations.map((c, i) => `(${i + 1}) ${c.snippet}`).join("\n");
}

function isWeakCitation(citation) {
  if (!citation || !citation.snippet) return true;
  const snippetLength = citation.snippet.length;

  const threshold = {
    course: 5,
    post: 20,
    test: 10,
    other: 15,
  };
  const key = citation.type || "other";
  const minLen = threshold[key] ?? 15;

  return snippetLength < minLen;
}
