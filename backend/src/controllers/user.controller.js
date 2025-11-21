import * as userService from "../services/user.service.js";

export async function getUsers(req, res) {
	const result = await userService.getUsers(req.query);
	res.status(200).json(result);
}

export async function getDashboardData(req, res) {
	const userId = req.user.id;
	const data = await userService.getDashboardData({ userId });

	res.status(200).json(data);
}

export async function updateRole(req, res) {
	const userId = req.params.id;
	const role = req.body.role;

	const user = await userService.updateRole({ userId, role });
	res.status(200).json({ user });
}

export async function getUserStats(req, res) {}
