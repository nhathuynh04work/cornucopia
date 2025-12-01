import { z } from "zod";
import { Role } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

const RoleSchema = z.enum([Role.USER, Role.ADMIN, Role.CREATOR]);

const UpdateUserBody = z.object({
	role: RoleSchema.optional(),
	isBlocked: z.boolean().optional(),
});

export const updateUserSchema = z.object({
	params: createIdParamSchema("id"),
	body: UpdateUserBody,
});
