import { createIdParamSchema } from "../utils/validate.js";

export const deleteTagSchema = {
	params: createIdParamSchema("id"),
};
