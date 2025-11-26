import { z } from "zod"; // Fixed import
import { ContentStatus } from "../generated/prisma/index.js";
import { createIdParamSchema } from "../utils/validate.js";

export const ContentStatusSchema = z.enum([
	ContentStatus.DRAFT,
	ContentStatus.PUBLIC,
]);

const UpdateModuleBody = z
	.object({
		title: z.string(),
		status: ContentStatusSchema,
	})
	.partial();

export const addLessonSchema = z.object({
	params: createIdParamSchema("id"),
});

export const updateModuleSchema = z.object({
	params: createIdParamSchema("id"),
	body: UpdateModuleBody,
});

export const deleteModuleSchema = z.object({
	params: createIdParamSchema("id"),
});
