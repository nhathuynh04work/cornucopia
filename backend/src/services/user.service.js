import * as userRepository from "../repositories/user.repository.js";
import { NotFoundError } from "../utils/AppError.js";

export async function updateBasicInfo(userId, data) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  return userRepository.update(userId, data);
}
