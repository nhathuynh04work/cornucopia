import { z } from "zod";

export const SignupSchema = z.object({
	email: z.string(),
	name: z.string(),
	password: z.string().min(8, "Password must have at least 8 characters"),
});

export const LoginSchema = z.object({
	email: z.string(),
	password: z.string().min(8, "Password must have at least 8 characters"),
});
