import { dashboardService } from "./dashboard.service.js";

const getAdminOverallStats = async (req, res) => {
	const data = await dashboardService.getAdminOverallStats();
	res.status(200).json({ data });
};

const getAdminChartData = async (req, res) => {
	const data = await dashboardService.getAdminChartData(req.query);
	res.status(200).json({ data });
};

const getCreatorOverallStats = async (req, res) => {
	const userId = req.user.id;
	const data = await dashboardService.getCreatorOverallStats({ userId });
	res.status(200).json({ data });
};

const getCreatorChartData = async (req, res) => {
	const userId = req.user.id;
	const data = await dashboardService.getCreatorChartData({
		userId,
		...req.query,
	});
	res.status(200).json({ data });
};

const getUserOverallStats = async (req, res) => {
	const userId = req.user.id;
	const data = await dashboardService.getUserOverallStats({ userId });
	res.status(200).json({ data });
};

export const dashboardController = {
	getAdminOverallStats,
	getAdminChartData,
	getCreatorOverallStats,
	getCreatorChartData,
	getUserOverallStats,
};
