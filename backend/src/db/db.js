import { Pool } from "pg";
import { env } from "../config/env.js";
import { Sequelize } from "sequelize";

const pool = new Pool({
	connectionString: env.DB_CONNECTION_STRING,
	max: 10,
	idleTimeoutMillis: 30000,
});

export default pool;

export const sequelize = new Sequelize(env.DB_CONNECTION_STRING);
