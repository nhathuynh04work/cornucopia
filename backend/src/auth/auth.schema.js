import { z } from "zod";

const SignupBody = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	password: z.string().min(8, "Password must have at least 8 characters"),
});

const LoginBody = z.object({
	email: z.string().email(),
	password: z.string().min(8, "Password must have at least 8 characters"),
});

const ConfirmEmailQuery = z.object({
	token: z.string().min(1),
});

export const signupSchema = z.object({
	body: SignupBody,
});

export const loginSchema = z.object({
	body: LoginBody,
});

export const confirmEmailSchema = z.object({
	query: ConfirmEmailQuery,
});
