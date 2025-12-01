import z from "zod";
import { createIdParamSchema } from "../utils/validate.js";

export const deleteMediaSchema = z.object({
	params: createIdParamSchema("id"),
});
