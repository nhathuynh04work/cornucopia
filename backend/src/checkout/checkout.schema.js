import { z } from "zod";
import { createIdParamSchema } from "../utils/validate.js";

export const createCheckoutSessionSchema = z.object({
	params: createIdParamSchema("courseId"),
});
