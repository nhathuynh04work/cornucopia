import z from "zod";
import { Role } from "../generated/prisma/index.js";

const RoleSchema = z.enum(Role);

export const UserSchema = z.object({
	email: z.email(),
	name: z.string().optional(),
	role: RoleSchema,
	avatarUrl: z.url().optional(),
	isActive: z.boolean(),
});

export const UpdateUserInfoSchema = z.object({
	name: z.string().max(100).optional(),
});

export const UpdateRoleSchema = z.object({
	role: RoleSchema,
});
