import { api } from "./axios";

function getRolePath(role) {
	return role?.toLowerCase() || "user";
}

const dashboardApi = {
	getOverallStats: async (role) => {
		const rolePath = getRolePath(role);
		const { data } = await api.get(`/dashboard/${rolePath}/stats`);
		return data.data;
	},

	getChartData: async (role, params) => {
		const rolePath = getRolePath(role);
		const { data } = await api.get(`/dashboard/${rolePath}/charts`, {
			params,
		});
		return data.data;
	},
};

export default dashboardApi;
