import z from "zod";

export const RequestUploadURLSchema = z.object({
	fileName: z.string().min(1, "fileName is required"),
	fileType: z.string().min(1, "fileType is required"),
});

export const entityEnum = {
	TEST: "test",
	TEST_ITEM: "testItem",
};

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

// It ensures the body matches *one* of these exact shapes.
export const LinkMediaSchema = z.discriminatedUnion("entityType", [
	LinkToTestSchema,
	LinkToTestItemSchema,
]);
