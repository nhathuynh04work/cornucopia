import { errorMessage } from "../utils/constants.js";

export function errorHandler(err, req, res, next) {
	err.statusCode = err.statusCode || 500;

	console.error(err);
	return res.status(err.statusCode).json({
		error: err.message || errorMessage.INTERNAL_ERROR,
	});
}
