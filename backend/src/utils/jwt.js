import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { expireTime } from "./constants.js";

const SECRET_KEY = env.JWT_SECRET;

export function createJWT(payload) {
	return jwt.sign(payload, SECRET_KEY, { expiresIn: expireTime.JWT_TOKEN });
}

export function verifyJWT(token) {
	try {
		const payload = jwt.verify(token, SECRET_KEY);
		return { payload, expired: false };
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return { payload: null, expired: true };
		}
		return { payload: null, expired: false };
	}
}
