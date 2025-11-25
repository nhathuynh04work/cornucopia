import { tokenize, toLC } from "./tokenize.js";
/**
 * Tổng hợp lại reranker với logic tổng quát:
 * - Ưu tiên các đoạn có giao cắt nhiều token query
 * - Boost nếu chứa cụm "định nghĩa", "là gì", "cách hoạt động", v.v.
 * - Boost thêm nếu có chứa từ khóa chủ đề (topicHint)
 * - Áp dụng cho mọi domain: ngôn ngữ, lập trình, mạng, AI, v.v.
 */
export function rerank(hits, query, topicHint = "") {
	if (!hits?.length) return [];

	const qTokens = tokenize(query);
	if (!qTokens.length) return hits;

	const qSet = new Set(qTokens);
	const lowerTopic = toLC(topicHint || "");

	// Cụm phổ biến tổng quát giúp nhận diện đoạn “định nghĩa / mô tả / hướng dẫn”
	const GENERAL_BOOSTERS = [
		"là gì",
		"định nghĩa",
		"mô tả",
		"cấu trúc",
		"hoạt động",
		"cách hoạt động",
		"cách dùng",
		"cách sử dụng",
		"ví dụ",
		"ứng dụng",
		"tác dụng",
		"các bước",
		"quy trình",
		"hướng dẫn",
		"so sánh",
		"phân biệt",
		"ưu điểm",
		"nhược điểm",
		"giải thích",
	];

	return hits
		.map((h) => {
			const txt = toLC(
				`${h.title || ""} ${h.content || ""} ${h.fragment || ""}`
			);

			// Đếm mức độ giao cắt token với câu hỏi
			let overlap = 0;
			for (const t of qSet) if (txt.includes(t)) overlap++;

			// Đếm số cụm booster xuất hiện
			let phrase = 0;
			for (const p of GENERAL_BOOSTERS) if (txt.includes(p)) phrase++;

			// Nếu có chủ đề → boost thêm
			const topicBoost =
				lowerTopic && txt.includes(lowerTopic) ? 0.25 : 0;

			// Tăng điểm theo tỉ lệ hợp lý
			const alpha = 0.04; // token overlap weight
			const beta = 0.18; // booster phrase weight

			const score2 =
				(h.score ?? 0) + overlap * alpha + phrase * beta + topicBoost;

			return { ...h, score2 };
		})
		.sort((a, b) => b.score2 - a.score2);
}
