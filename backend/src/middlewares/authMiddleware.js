import { UnauthorizedError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";
import { verifyJWT } from "../utils/jwt.js";

export async function authenticateJWT(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader)
		throw new UnauthorizedError(errorMessage.MISSING_AUTH_HEADER);

	const token = authHeader.split(" ")[1];
	if (!token) throw new UnauthorizedError(errorMessage.MISSING_TOKEN);

	const { payload, expired } = verifyJWT(token);
	if (expired) throw new UnauthorizedError(errorMessage.EXPIRED_TOKEN);
	if (!payload) throw new UnauthorizedError(errorMessage.INVALID_TOKEN);

	req.user = { ...payload, id: payload.sub };
	next();
}
