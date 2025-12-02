import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/index.js";
import "dotenv/config";

const connectionString = process.env.DB_URL;

const pool = new Pool({
	connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
	adapter,
});

export default prisma;
