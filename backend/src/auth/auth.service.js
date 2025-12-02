import bcrypt from "bcrypt";
import { createEmailToken, sendConfirmationEmail } from "../utils/email.js";
import { createJWT } from "../utils/jwt.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/AppError.js";
import prisma from "../prisma.js";
import { errorMessage } from "../utils/constants.js";
import { Provider } from "../generated/prisma/index.js";

const localSignup = async ({ email, name, password }) => {
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) throw new BadRequestError(errorMessage.EMAIL_REGISTERED);

	const result = createEmailToken();
	const passwordHash = await bcrypt.hash(password, 10);

	await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({
			data: {
				name,
				email,
				authentication: {
					passwordHash,
					provider: Provider.LOCAL,
				},
			},
		});

		await tx.emailVerificationToken.create({
			data: {
				...result,
				userId: user.id,
			},
		});
	});

	sendConfirmationEmail(email, result.token);
};

const confirmEmail = async (token) => {
	const info = await prisma.emailVerificationToken.findUnique({
		where: { token },
	});
	if (!info) throw new BadRequestError(errorMessage.INVALID_TOKEN);

	const { userId, expiresAt } = info;

	if (new Date() > expiresAt) {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		const newToken = await getConfirmationToken(user);
		sendConfirmationEmail(user.email, newToken);
		throw new BadRequestError(errorMessage.EXPIRED_TOKEN);
	}

	const user = await prisma.$transaction(async (tx) => {
		await tx.emailVerificationToken.delete({
			where: { token: token },
		});
		return tx.user.update({
			where: { id: userId },
			data: { isActive: true },
		});
	});

	return createJWT({ sub: user.id, email: user.email });
};

const getCurrentUser = async (id) => {
	const user = await prisma.user.findUnique({ where: { id } });

	if (!user) throw new NotFoundError(errorMessage.USER_NOT_FOUND);

	return user;
};

const localLogin = async ({ email, password }) => {
	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) throw new NotFoundError(errorMessage.USER_NOT_FOUND);

	if (user.isBlocked) {
		throw new ForbiddenError(
			"Your account has been suspended. Please contact support."
		);
	}

	if (!user.isActive) {
		const token = await getConfirmationToken(user);
		sendConfirmationEmail(user.email, token);
		throw new ForbiddenError(errorMessage.UNCONFIRMED_USER);
	}

	const auth = await prisma.authentication.findUnique({
		where: {
			provider_userId: {
				provider: Provider.LOCAL,
				userId: user.id,
			},
		},
	});
	if (!auth) throw new NotFoundError(errorMessage.USER_NOT_FOUND);

	const isMatch = bcrypt.compare(password, auth.passwordHash);
	if (!isMatch) throw new BadRequestError(errorMessage.INVALID_PASSWORD);

	return createJWT({
		sub: user.id,
		email: user.email,
		role: user.role,
	});
};

async function getConfirmationToken(user) {
	const tokenInfo = await prisma.emailVerificationToken.findUnique({
		where: { userId: user.id },
	});

	if (tokenInfo && new Date() <= tokenInfo.expiresAt) {
		return tokenInfo.token;
	}

	const result = createEmailToken();

	await prisma.$transaction(async (tx) => {
		if (tokenInfo) {
			await tx.emailVerificationToken.delete({
				where: { token: tokenInfo.token },
			});
		}
		await tx.emailVerificationToken.create({
			data: { ...result, userId: user.id },
		});
	});

	return result.token;
}

export const authService = {
	localSignup,
	confirmEmail,
	getCurrentUser,
	localLogin,
};
