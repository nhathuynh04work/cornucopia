import bcrypt from "bcrypt";
import crypto from "crypto";
import { withTransaction } from "../db/transaction.js";
import {
	getUserByEmail,
	createUser,
	activateUser,
	getUserById,
} from "../repositories/user.repository.js";
import { createLocalAuth } from "../repositories/auth.repository.js";
import {
	assignRoleToUser,
	getRoleByUserId,
} from "../repositories/role.repository.js";
import {
	createToken,
	deleteToken,
	getTokenInfo,
} from "../repositories/token.repository.js";
import { sendConfirmationEmail } from "../utils/email.js";
import { createJWT } from "../utils/jwt.js";
import { getLocalAuthByUserId } from "../repositories/auth.repository.js";

export async function localSignup({ email, name, password }) {
	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		throw { status: 400, error: "User already exists" };
	}

	return withTransaction(async (client) => {
		const user = await createUser(client, { name, email });

		const passwordHash = await bcrypt.hash(password, 10);
		await createLocalAuth(client, { userId: user.id, passwordHash });

		await assignRoleToUser(client, { userId: user.id, role: "user" });

		const token = crypto.randomBytes(32).toString("hex");
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

		await createToken(client, { userId: user.id, token, expiresAt });

		sendConfirmationEmail(email, token).catch(console.error);

		return {
			status: 201,
			message: "Signup successful, please verify your email.",
		};
	});
}

export async function confirmEmail({ token }) {
	const tokenRow = await getTokenInfo(token);
	if (!tokenRow) {
		throw { status: 400, error: "Token not found" };
	}

	const { user_id: userId, expires_at: expiresAt } = tokenRow;

	return withTransaction(async (client) => {
		if (new Date() > expiresAt) {
			await deleteToken(client, token);
			throw { status: 400, error: "Token has expired" };
		}

		await activateUser(client, { userId });
		await deleteToken(client, token);

		const jwtToken = createJWT({ userId });
		return {
			status: 200,
			message: "Email confirmed successfully",
			token: jwtToken,
		};
	});
}

export async function getCurrentUser({ userId }) {
	const user = await getUserById(userId);

	if (!user) {
		throw { status: 404, error: "User not found" };
	}

	const role = await getRoleByUserId(userId);

	return {
		status: 200,
		message: "Retrieved user successfully",
		user: {
			...user,
			role,
		},
	};
}

export async function localLogin({ email, password }) {
	const user = await getUserByEmail(email);

	if (!user) {
		throw { status: 400, error: "Invalid email or password" };
	}

	if (!user.is_active) {
		throw {
			status: 403,
			error: "Please verify your email to activate your account",
		};
	}

	const auth = await getLocalAuthByUserId(user.id);

	if (!auth) {
		throw { status: 400, error: "Invalid email or password" };
	}

	const isMatch = await bcrypt.compare(password, auth.password_hash);

	if (!isMatch) {
		throw { status: 400, error: "Invalid email or password" };
	}

	const jwtToken = createJWT({ userId: user.id });
	return { status: 200, message: "Login successful", token: jwtToken };
}
