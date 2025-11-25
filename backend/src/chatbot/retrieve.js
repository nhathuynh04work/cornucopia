import * as ragRepo from "./rag.repository.js";
import { tokenize } from "./tokenize.js";

export async function retrieve(query, k = 6, filters = {}) {
	const q = String(query || "").trim();
	if (!q) return [];

	const limit = Math.min(20, Math.max(1, k));
	const tokens = tokenize(q);

	// ===== COURSE: resolve courseIds
	let courseIds = Array.isArray(filters.courseIds) ? filters.courseIds : [];
	if (
		!courseIds?.length &&
		Array.isArray(filters.courseNames) &&
		filters.courseNames.length
	) {
		courseIds = await ragRepo.findCourseIdsByNames(filters.courseNames);
	}

	// ===== BLOG search
	let blogRows = await ragRepo.searchChunksFT(q, limit);
	if (!blogRows.length && tokens.length >= 2) {
		blogRows = await ragRepo.searchChunksFT_OR(tokens, limit);
	}
	if (!blogRows.length && tokens.length >= 2) {
		const patterns = tokens.map((t) => `%${t}%`);
		blogRows = await ragRepo.searchChunksILIKE(patterns, limit);
	}

	// ===== COURSE search
	let courseRows = await ragRepo.searchCourseChunksFT(q, limit, courseIds);
	if (!courseRows.length && tokens.length >= 2) {
		courseRows = await ragRepo.searchCourseChunksFT_OR(
			tokens,
			limit,
			courseIds
		);
	}
	if (!courseRows.length && tokens.length >= 2) {
		const patterns = tokens.map((t) => `%${t}%`);
		courseRows = await ragRepo.searchCourseChunksILIKE(
			patterns,
			limit,
			courseIds
		);
	}

	// ===== Merge & cap
	const merged = [
		...blogRows.map((r) => ({ source: "post", ...r })),
		...courseRows,
	];
	merged.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
	return merged.slice(0, limit);
}
