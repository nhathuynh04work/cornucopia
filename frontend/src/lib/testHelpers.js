/**
 * Generates a mapping of item IDs to their display numbers (e.g., "1", "2-4").
 * Useful for Test Editor sidebar, Test Attempt navigation, and Results view.
 *
 * @param {Array} items The nested array of test items (including Groups).
 * @returns {Object} A map where keys are item IDs and values are objects { display: string, start: number, end: number }
 */
export function getQuestionNumberMap(items = []) {
	const map = {};
	let currentCount = 1;

	items.forEach((item) => {
		if (item.type === "GROUP") {
			const childrenCount = item.children?.length || 0;
			if (childrenCount === 0) {
				map[item.id] = { display: "---", start: null, end: null };
			} else {
				const start = currentCount;
				const end = currentCount + childrenCount - 1;
				map[item.id] = {
					display: start === end ? `${start}` : `${start}-${end}`,
					start,
					end,
				};
				currentCount += childrenCount;
			}
		} else {
			map[item.id] = {
				display: `${currentCount}`,
				start: currentCount,
				end: currentCount,
			};
			currentCount++;
		}
	});

	return map;
}
