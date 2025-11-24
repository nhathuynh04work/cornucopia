import * as dashboardService from "../services/dashboard.service.js";

export async function getAdminOverallStats(req, res) {
	const data = await dashboardService.getAdminOverallStats();
	res.status(200).json({ data });
}

export async function getAdminChartData(req, res) {
	const data = await dashboardService.getAdminChartData(req.query);
	res.status(200).json({ data });
}

export async function getCreatorOverallStats(req, res) {
	const userId = req.user.id;

	const data = await dashboardService.getCreatorOverallStats({ userId });
	res.status(200).json({ data });
}

export async function getCreatorChartData(req, res) {
	const userId = req.user.id;

	const data = await dashboardService.getCreatorChartData({
		userId,
		...req.query,
	});
	res.status(200).json({ data });
}

export async function getUserOverallStats(req, res) {
	const userId = req.user.id;

	const data = await dashboardService.getUserOverallStats({ userId });
	res.status(200).json({ data });
}
