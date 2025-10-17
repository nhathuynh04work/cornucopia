export const validateParams = (paramNames) => (req, res, next) => {
	for (const name of paramNames) {
		const paramValue = req.params[name];
		const id = parseInt(paramValue, 10);

		if (isNaN(id) || id < 1) {
			return res.status(400).json({
				message: `Invalid parameter. '${name}' must be a positive integer.`,
			});
		}
		req.params[name] = id;
	}

	return next();
};
