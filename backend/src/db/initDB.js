import { sequelize } from "../models/index.js";

async function initDB() {
	try {
		await sequelize.authenticate();
		console.log("Database connection established");

		// Only run sync if you want Sequelize to manage tables
		// For production, use migrations instead
		await sequelize.sync({ alter: true });
		console.log("Models synchronized");
	} catch (err) {
		console.error("Database initialization failed:", err);
		process.exit(1);
	}
}

export default initDB;
