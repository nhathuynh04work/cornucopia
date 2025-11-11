import bcrypt from "bcryptjs";
import * as userRepository from "../repositories/user.repository.js";
import { NotFoundError, BadRequestError } from "../utils/AppError.js";

export async function updateBasicInfo(userId, data) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  return userRepository.update(userId, data);
}

export async function changePassword(userId, { oldPassword, newPassword }) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new BadRequestError("Mật khẩu cũ không chính xác");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return userRepository.update(userId, { password: hashedPassword });
}