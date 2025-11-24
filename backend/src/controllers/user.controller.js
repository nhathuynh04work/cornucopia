import * as userService from "../services/user.service.js";

export async function getUsers(req, res) {
	const result = await userService.getUsers(req.query);
	res.status(200).json(result);
}

export async function getLandingData(req, res) {
	const data = await userService.getLandingData();
	res.status(200).json({ data });
}

export async function getDashboardData(req, res) {
	const userId = req.user.id;
	const data = await userService.getDashboardData({ userId });

	res.status(200).json({ data });
}

export async function updateRole(req, res) {
	const userId = req.params.id;
	const role = req.body.role;

	const user = await userService.updateRole({ userId, role });
	res.status(200).json({ user });
}

export async function getAdminOverallStats(req, res) {
	const data = await userService.getAdminOverallStats();
	res.status(200).json({ data });
}

export async function getAdminChartData(req, res) {
	const data = await userService.getAdminChartData(req.query);
	res.status(200).json({ data });
}
