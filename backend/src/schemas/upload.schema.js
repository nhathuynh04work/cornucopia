import { z } from "zod";

export const GetUploadParamsSchema = z.object({
	fileName: z.string(),
	fileType: z.string(),
});

export const ConfirmUploadSchema = z.object({
	fileUrl: z.string(),
	fileType: z.string(),
});
