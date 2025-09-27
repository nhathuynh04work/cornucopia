import { sequelize } from "../models/index.js";
import db from "./db.js";

export async function withTransaction(fn) {
	const client = await db.connect();
	try {
		await client.query("BEGIN");
		const result = await fn(client);
		await client.query("COMMIT");
		return result;
	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
}

export async function withTransactionSequelize(taskFn) {
	const transaction = await sequelize.transaction();
	try {
		const result = await taskFn(transaction);
		await transaction.commit();
		return result;
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
}
