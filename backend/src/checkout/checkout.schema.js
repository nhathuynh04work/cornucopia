import { createIdParamSchema } from "../utils/validate.js";

export const createCheckoutSessionSchema = {
	params: createIdParamSchema("courseId"),
};
