import { z } from "zod";
import { createIdParamSchema } from "../utils/validate.js";

export const deleteTagSchema = z.object({
	params: createIdParamSchema("id"),
});
