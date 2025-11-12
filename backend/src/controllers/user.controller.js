import * as userService from "../services/user.service.js";

export async function getUsers(req, res) {
	const result = await userService.getUsers(req.query);
	res.status(200).json(result);
}

export async function getUserStats(req, res) {}
