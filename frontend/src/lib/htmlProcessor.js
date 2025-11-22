// Extract h2 and h3 tags from html text to form a table of contents
export function processContent(htmlString) {
	if (!htmlString) return { html: "", headings: [] };

	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, "text/html");
	const headings = [];

	doc.querySelectorAll("h2, h3").forEach((el, index) => {
		const text = el.textContent;
		const slug =
			text.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${index}`;

		el.id = slug;
		headings.push({
			id: slug,
			text: text,
			level: Number(el.tagName.substring(1)),
		});
	});

	return {
		html: doc.body.innerHTML,
		headings,
	};
}
