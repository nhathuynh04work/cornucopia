export function getReadingTime(text) {
	if (!text) return 0;
	const wordsPerMinute = 200;
	const wordCount = text.trim().split(/\s+/).length;
	const minutes = wordCount / wordsPerMinute;
	return Math.max(1, Math.round(minutes * 60));
}
