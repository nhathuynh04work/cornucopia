import { BadRequestError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export const validateParams = (paramNames) => (req, res, next) => {
	for (const name of paramNames) {
		const paramValue = req.params[name];
		const id = parseInt(paramValue, 10);

		if (isNaN(id) || id < 1)
			throw new BadRequestError(errorMessage.INVALID_PARAMS);

		req.params[name] = id;
	}

	return next();
};
