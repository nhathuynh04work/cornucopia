import z from "zod";
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

export const addLessonSchema = {
	params: createIdParamSchema("id"),
};

export const updateModuleSchema = {
	params: createIdParamSchema("id"),
	body: UpdateModuleBody,
};

export const deleteModuleSchema = {
	params: createIdParamSchema("id"),
};
