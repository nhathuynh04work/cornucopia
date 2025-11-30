export const toArray = (val) => {
	if (!val) return undefined;
	return Array.isArray(val) ? val : [val];
};

export const mapToContentLanguage = (input) => {
	const CONTENT_LANGUAGE_MAP = {
		en: "ENGLISH",
		ja: "JAPANESE",
		ko: "KOREAN",
		zh: "CHINESE",
		fr: "FRENCH",
		es: "SPANISH",
	};
    
	if (!input) return [];
	const inputs = Array.isArray(input) ? input : [input];

	return inputs
		.map((l) => CONTENT_LANGUAGE_MAP[l.toLowerCase()])
		.filter((l) => l !== undefined);
};
