export function validate(schema) {
	return (req, res, next) => {
		const dataToValidate = {
			params: req.params,
			query: req.query,
			body: req.body,
		};

		const result = schema.safeParse(dataToValidate);

		if (!result.success) {
			throw result.error;
		}

		if (result.data.params) {
			req.params = result.data.params;
		}

		if (result.data.body) {
			req.body = result.data.body;
		}

		if (result.data.query) {
			Object.assign(req.query, result.data.query);
		}

		next();
	};
}
