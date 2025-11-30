export const toArray = (val) => {
	if (!val) return undefined;
	return Array.isArray(val) ? val : [val];
};
