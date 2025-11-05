import * as userService from "../services/user.service.js";

export async function updateUserBasicInfo(req, res) {
  const userId = req.user.id;
  const updatedUser = await userService.updateBasicInfo(userId, req.body);

  res.status(200).json({
    data: updatedUser,
  });
}
