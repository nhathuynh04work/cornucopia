import z from "zod";
import { createIdParamSchema } from "../utils/validate.js";

export const EntityTypeEnum = z.enum([
	"test",
	"testItem",
	"user",
	"course",
	"lesson",
	"post",
]);

const RequestUploadURLBody = z.object({
	fileName: z.string().min(1, "fileName is required"),
	fileType: z.string().min(1, "fileType is required"),
});

const SetPropertyBody = z.object({
	entityType: EntityTypeEnum,
	entityId: z.coerce.number().positive(),
	url: z.url("A valid URL is required"),
	duration: z.number().int().nonnegative().optional(),
});

const BaseMedia = z.object({
	url: z.url("A valid URL is required"),
	fileType: z.string().min(1),
});

const LinkToTest = BaseMedia.extend({
	entityType: z.literal("test"),
	entityId: z.number().int(),
});

const LinkToTestItem = BaseMedia.extend({
	entityType: z.literal("testItem"),
	entityId: z.number().int(),
});

const LinkToPost = BaseMedia.extend({
	entityType: z.literal("post"),
	entityId: z.number().int(),
});

const LinkMediaBody = z.discriminatedUnion("entityType", [
	LinkToTest,
	LinkToTestItem,
	LinkToPost,
]);

export const requestUploadURLSchema = z.object({
	body: RequestUploadURLBody,
});

export const setPropertySchema = z.object({
	body: SetPropertyBody,
});

export const linkMediaSchema = z.object({
	body: LinkMediaBody,
});

export const deleteMediaSchema = z.object({
	params: createIdParamSchema("id"),
});
