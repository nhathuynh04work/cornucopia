import { ForbiddenError, UnauthorizedError } from "../utils/AppError.js";
import { verifyJWT } from "../utils/jwt.js";

export async function authenticateJwt(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) throw new UnauthorizedError("Unauthorized");

	const token = authHeader.split(" ")[1];
	if (!token) throw new UnauthorizedError("Token not found");

	const { payload, expired } = verifyJWT(token);
	if (expired) throw new UnauthorizedError("Token expired");
	if (!payload) throw new UnauthorizedError("Invalid token");

	req.user = { ...payload, id: payload.sub };
	next();
}

export function requireRole(...allowedRoles) {
	return (req, res, next) => {
		const user = req.user;

		if (!user) {
			throw new UnauthorizedError("Unauthorized");
		}

		if (!allowedRoles.includes(user.role)) {
			throw new ForbiddenError(
				"You don't have the privilege to execute this action"
			);
		}

		next();
	};
}
