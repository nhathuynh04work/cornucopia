import z from "zod";
import { Role } from "../generated/prisma/index.js";

const RoleSchema = z.enum(Role);

const UserSchema = z.object({
	email: z.email(),
	name: z.string().optional(),
	role: RoleSchema,
	avatarUrl: z.url().optional(),
	isActive: z.boolean(),
});

export const UpdateUserInfoSchema = UserSchema.omit({ role: true }).partial();

export const UpdateRoleSchema = UserSchema.pick({ role: true });
