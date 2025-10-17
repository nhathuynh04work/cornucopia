export function errorHandler(err, req, res, next) {
	err.statusCode = err.statusCode || 500;

	console.error("ERROR:", err);
	return res.status(err.statusCode).json({
		message: "Something went very wrong!",
	});
}
