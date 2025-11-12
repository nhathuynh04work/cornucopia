import { ForbiddenError, UnauthorizedError } from "../utils/AppError.js";

export function requireRole(...allowedRoles) {
	return (req, res, next) => {
		const user = req.user;

		if (!user) {
			throw new UnauthorizedError("Unauthorized");
		}

		if (!allowedRoles.includes(user.role)) {
			throw new ForbiddenError("Forbidden");
		}
        
		next();
	};
}
