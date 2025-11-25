import { userService } from "./user.service.js";

const getUsers = async (req, res) => {
	const result = await userService.getUsers(req.query);
	res.status(200).json(result);
};

const getLandingData = async (req, res) => {
	const data = await userService.getLandingData();
	res.status(200).json({ data });
};

const getDashboardData = async (req, res) => {
	const userId = req.user.id;
	const data = await userService.getDashboardData({ userId });

	res.status(200).json({ data });
};

const updateRole = async (req, res) => {
	const userId = req.params.id;
	const role = req.body.role;

	const user = await userService.updateRole({ userId, role });
	res.status(200).json({ user });
};

const getAdminOverallStats = async (req, res) => {
	const data = await userService.getAdminOverallStats();
	res.status(200).json({ data });
};

const getAdminChartData = async (req, res) => {
	const data = await userService.getAdminChartData(req.query);
	res.status(200).json({ data });
};

export const userController = {
	getUsers,
	getLandingData,
	getDashboardData,
	updateRole,
	getAdminOverallStats,
	getAdminChartData,
};
