import { z } from "zod";
import { Role } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

const RoleSchema = z.enum([Role.USER, Role.ADMIN, Role.CREATOR]);

const UpdateUserBody = z.object({
	role: RoleSchema.optional(),
	isBlocked: z.boolean().optional(),
});

export const getUserSchema = z.object({
	params: createIdParamSchema("id"),
});

export const updateUserSchema = z.object({
	params: createIdParamSchema("id"),
	body: UpdateUserBody,
});

const UpdateSelfBody = z.object({
	name: z.string().min(1, "Name is required").optional(),
	bio: z.string().max(500, "Bio is too long").optional(),
	avatarUrl: z.url("Invalid URL").optional().or(z.literal("")),
});

export const updateSelfSchema = z.object({
	body: UpdateSelfBody,
});
