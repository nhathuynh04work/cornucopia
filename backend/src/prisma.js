import "dotenv/config";
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient({
	datasourceUrl: process.env.DB_URL,
});

export default prisma;
