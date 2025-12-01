import { syncStatsJob } from "./syncStats.js";

export const initCronJobs = () => {
	console.log("Initializing Cron Jobs...");

	syncStatsJob();
};
