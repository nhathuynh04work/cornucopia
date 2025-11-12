import { BadRequestError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export function validateSchema(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      return next();
    }

    throw new BadRequestError(errorMessage.INVALID_INPUT);
  };
}
