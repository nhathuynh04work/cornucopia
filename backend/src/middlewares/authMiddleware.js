import { verifyJWT } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ error: "Missing auth header" });
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "Missing token" });
	}

	try {
		const decoded = verifyJWT(token);
		if (!decoded) {
			return res
				.status(401)
				.json({ error: "Auth Middleware: decoded null" });
		}

		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
};
