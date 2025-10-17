export function validateSchema(schema) {
	return (req, res, next) => {
		const result = schema.safeParse(req.body);

		if (result.success) {
			req.body = result.data;
			return next();
		}

		return res.status(400).json({
			message: "Input validation failed",
			errors: result.error.flatten().fieldErrors,
		});
	};
}
