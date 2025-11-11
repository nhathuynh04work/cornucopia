import z from "zod";
import { ContentStatus } from "../generated/prisma/index.js";

export const ContentStatusSchema = z.enum(ContentStatus);

const ModuleSchema = z.object({
	title: z.string(),
	status: ContentStatusSchema,
});

export const UpdateModuleSchema = ModuleSchema.partial();
