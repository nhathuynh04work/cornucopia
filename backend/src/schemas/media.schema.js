import z from "zod";

// Schema for request upload url route
export const RequestUploadURLSchema = z.object({
	fileName: z.string().min(1, "fileName is required"),
	fileType: z.string().min(1, "fileType is required"),
});

export const entityEnum = {
	TEST: "test",
	TEST_ITEM: "testItem",
	USER: "user",
	COURSE: "course",
	LESSON: "lesson",
	POST: "post",
};

export const EntityType = z.enum([
	entityEnum.TEST,
	entityEnum.TEST_ITEM,
	entityEnum.USER,
	entityEnum.COURSE,
	entityEnum.LESSON,
	entityEnum.POST,
]);

// Schema for linking a media to an entity (one-to-many)
const BaseMediaSchema = z.object({
	url: z.url("A valid URL is required"),
	fileType: z.string().min(1),
});

const LinkToTestSchema = BaseMediaSchema.extend({
	entityType: z.literal(entityEnum.TEST),
	entityId: z.number().int(),
});

const LinkToTestItemSchema = BaseMediaSchema.extend({
	entityType: z.literal(entityEnum.TEST_ITEM),
	entityId: z.number().int(),
});

const LinkToPostSchema = BaseMediaSchema.extend({
	entityType: z.literal(entityEnum.POST),
	entityId: z.number().int(),
});

export const LinkMediaSchema = z.discriminatedUnion("entityType", [
	LinkToTestSchema,
	LinkToTestItemSchema,
	LinkToPostSchema,
]);

// Schema for adding media as a field (one-to-one)
export const SetPropertySchema = z.object({
	entityType: EntityType,
	entityId: z.coerce.number().positive(),
	url: z.url("A valid URL is required"),
	duration: z.number().int().nonnegative().optional(),
});
