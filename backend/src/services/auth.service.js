import bcrypt from "bcrypt";
import * as userRepo from "../repositories/user.repository.js";
import * as tokenRepo from "../repositories/token.repository.js";
import * as authRepo from "../repositories/auth.repository.js";
import { createEmailToken, sendConfirmationEmail } from "../utils/email.js";
import { createJWT } from "../utils/jwt.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/AppError.js";
import prisma from "../prisma.js";
import { errorMessage, providers } from "../utils/constants.js";

export async function localSignup({ email, name, password }) {
	const existing = await userRepo.findByEmail(email);
	if (existing) throw new BadRequestError(errorMessage.EMAIL_REGISTERED);

	const result = createEmailToken();
	const passwordHash = await bcrypt.hash(password, 10);

	await prisma.$transaction(async (tx) => {
		const user = await userRepo.create(
			{ name, email },
			{ passwordHash, provider: providers.local },
			tx
		);
		await tokenRepo.create({ ...result, userId: user.id }, tx);
	});

	sendConfirmationEmail(email, result.token);
}

export async function confirmEmail(token) {
	const info = await tokenRepo.findBy("token", token);
	if (!info) throw new BadRequestError(errorMessage.INVALID_TOKEN);

	const { userId, expiresAt } = info;

	if (new Date() > expiresAt) {
		const user = await userRepo.findById(userId);
		const newToken = await getConfirmationToken(user);
		sendConfirmationEmail(user.email, newToken);
		throw new BadRequestError(errorMessage.EXPIRED_TOKEN);
	}

	const user = await prisma.$transaction(async (tx) => {
		await tokenRepo.remove(token, tx);
		return userRepo.activate(userId, tx);
	});

	return createJWT({ sub: user.id, email: user.email });
}

export async function getCurrentUser(id) {
	const user = await userRepo.findById(id);
	if (!user) throw new NotFoundError(errorMessage.USER_NOT_FOUND);

	return user;
}

export async function localLogin({ email, password }) {
	const user = await userRepo.findByEmail(email);

	if (!user) throw new NotFoundError(errorMessage.USER_NOT_FOUND);
	if (!user.isActive) {
		const token = await getConfirmationToken(user);
		sendConfirmationEmail(user.email, token);
		throw new ForbiddenError(errorMessage.UNCONFIRMED_USER);
	}

	const auth = await authRepo.findLocalAuth(user.id);
	if (!auth) throw new NotFoundError(errorMessage.USER_NOT_FOUND);

	const isMatch = await bcrypt.compare(password, auth.passwordHash);
	if (!isMatch) throw new BadRequestError(errorMessage.INVALID_PASSWORD);

	return createJWT({ sub: user.id, email: user.email });
}

async function getConfirmationToken(user) {
	const tokenInfo = await tokenRepo.findBy("userId", user.id);

	// Case 1: Token is valid, just return it.
	if (tokenInfo && new Date() <= tokenInfo.expiresAt) {
		return tokenInfo.token;
	}

	// Case 2: Token is expired or missing. Create a new one.
	const result = createEmailToken();

	await prisma.$transaction(async (tx) => {
		if (tokenInfo) {
			await tokenRepo.remove(tokenInfo.token, tx);
		}
		await tokenRepo.create({ ...result, userId: user.id }, tx);
	});

	return result.token;
}
