import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const SECRET_KEY = env.JWT_SECRET;
const EXPIRES_IN = "24h";

export function createJWT(payload) {
	return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
}

export function verifyJWT(token) {
	return jwt.verify(token, SECRET_KEY);
}
