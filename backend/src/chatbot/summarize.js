import { getSnippet } from "./utils.js";
import { getAiClient } from "./aiClient.js";
import { defaults } from "../utils/constants.js";

// return text response from AI model and citations for related content
export async function summarize(hits, query) {
	// no hits => default answer
	if (hits.length === 0) return defaults.CHATBOT_ANSWER;

	// prepare citation list
	const citations = hits
		.map((h) => getCitationItem(h))
		.filter((c) => !isWeakCitation(c));

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

                        Dưới đây là nội dung liên quan từ Cornucopia Blog và Courses:
                        ${contextBullets}

                        Hãy viết lại câu trả lời tự nhiên bằng tiếng Việt (2–5 câu), súc tích, không chèn HTML, không lặp lại nguyên văn.
                        Nếu câu hỏi đó không có liên quan đến trang blog, mà nó liên quan đến việc học ngoại ngữ thì hãy trả lời theo suy nghĩ của bạn, còn khác chủ đề thì hãy từ chối trả lời một cách lịch sự.
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
	const result = {
		title: data.title,
		snippet: getSnippet(data.content || data.fragment || ""),
	};

	if (data.source === "course") {
		result.type = data.source;
		result.url = `/courses/${data.courseId}`;
	}

	if (data.source === "post") {
		result.type = data.source;
		result.url = `/posts/${data.postId}`;
	}

	return result;
}

function getBulletContextList(citations) {
	return citations.map((c, i) => `(${i + 1}) ${c.snippet}`).join("\n");
}

function isWeakCitation(citation) {
	const snippetLength = citation.snippet.length;

	const threshold = {
		course: 5,
		post: 20,
	};

	return snippetLength < threshold[citation.type];
}
