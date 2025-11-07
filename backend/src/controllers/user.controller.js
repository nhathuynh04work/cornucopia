import * as userService from "../services/user.service.js";

export async function updateUserBasicInfo(req, res) {
  const userId = req.user.id;
  const updatedUser = await userService.updateBasicInfo(userId, req.body);

  res.status(200).json({
    data: updatedUser,
  });
}

export async function changeUserPassword(req, res) {
  const userId = req.user.id;
  const updatedUser = await userService.changePassword(userId, req.body);

  res.status(200).json({
    message: "Mật khẩu đã được thay đổi thành công",
    data: updatedUser,
  });
}