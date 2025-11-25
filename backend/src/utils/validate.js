import { z } from "zod";

export const createIdParamSchema = (paramName = "id") =>
	z.object({
		[paramName]: z.coerce.number().int().positive(),
	});
