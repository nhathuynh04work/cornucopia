import { z } from "zod"; 
import { Role } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

const RoleSchema = z.enum([Role.USER, Role.ADMIN, Role.CREATOR]);

const UpdateRoleBody = z.object({
	role: RoleSchema,
});

export const updateRoleSchema = z.object({
	params: createIdParamSchema("id"),
	body: UpdateRoleBody,
});
