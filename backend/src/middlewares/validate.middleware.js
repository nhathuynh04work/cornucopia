import { BadRequestError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export function validate(schema) {
	return (req, res, next) => {
		try {
			if (schema.params) {
				const result = schema.params.safeParse(req.params);
				if (!result.success) throw result.error;

				req.params = result.data;
			}

			if (schema.query) {
				const result = schema.query.safeParse(req.query);
				if (!result.success) throw result.error;

				Object.assign(req.query, result.data);
			}

			if (schema.body) {
				const result = schema.body.safeParse(req.body);
				if (!result.success) throw result.error;
				req.body = result.data;
			}

			next();
		} catch (error) {
			throw new BadRequestError(errorMessage.INVALID_INPUT);
		}
	};
}
