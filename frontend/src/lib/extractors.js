// Extract list of { term, definition } from a text area input
export function extractCards(text, separator) {
	if (!text.trim()) return [];

	const lines = text.split("\n");

	return lines
		.map((line) => {
			if (!line.trim()) return null;

			// For dash, we use " - " (space dash space) to avoid splitting hyphenated words
			const splitChar = separator === "tab" ? "\t" : " - ";

			const parts = line.split(splitChar);

			const term = parts[0]?.trim() || "";

			// Join the rest back in case the definition itself contained the separator
			const definition = parts.slice(1).join(splitChar).trim();

			if (!term) return null;

			return {
				id: `temp-import-${Math.random().toString(36).substr(2, 9)}`,
				term,
				definition,
			};
		})
		.filter(Boolean);
}
