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
};

// Schema for linking a media to an entity (one-to-many)
const BaseMediaSchema = z.object({
	s3Key: z.string().min(1),
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

export const LinkMediaSchema = z.discriminatedUnion("entityType", [
	LinkToTestSchema,
	LinkToTestItemSchema,
]);

// Schema for adding media as a field (one-to-one)
export const EntityType = z.enum([entityEnum.USER, entityEnum.COURSE]);

export const PropertyType = z.enum(["avatarUrl", "coverUrl"]);

export const SetPropertySchema = z.object({
	entityType: EntityType,
	entityId: z.coerce.number().positive(),
	property: PropertyType,
	s3Key: z.string().min(1, "s3Key is required"),
});
