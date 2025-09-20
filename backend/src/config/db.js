import { Pool } from "pg";
import { env } from "./env.js";

const pool = new Pool({
	connectionString: env.DB_CONNECTION_STRING,
	max: 10,
	idleTimeoutMillis: 30000,
});

export default pool;
