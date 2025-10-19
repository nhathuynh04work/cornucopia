import { BadRequestError } from "../utils/AppError.js";

export function validateQueries(queryNames) {
	return (req, res, next) => {
		const missingQueries = [];

		for (const name of queryNames) {
			const queryValue = req.query[name];
			if (
				queryValue === undefined ||
				queryValue === null ||
				queryValue === ""
			) {
				missingQueries.push(name);
			}
		}

		if (missingQueries.length > 0) {
			const message = `Missing queries: ${missingQueries.join(", ")}`;
			throw new BadRequestError(message);
		}

		next();
	};
}
