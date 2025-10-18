export function errorHandler(err, req, res, next) {
	err.statusCode = err.statusCode || 500;

	console.error(err);
	return res.status(err.statusCode).json({
		message: "Internal server error",
	});
}
