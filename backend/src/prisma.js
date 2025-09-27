import { PrismaClient } from "./generated/prisma/index.js";

let prisma;
if (!global.prisma) {
	prisma = new PrismaClient();
	global.prisma = prisma;
} else {
	prisma = global.prisma;
}

async function shutdownPrisma(signal) {
	try {
		console.log(`[Prisma] Disconnecting due to ${signal}`);
		await prisma.$disconnect();
		console.log("[Prisma] Disconnected.");
		process.exit(0);
	} catch (err) {
		console.error("[Prisma] Error during disconnect:", err);
		process.exit(1);
	}
}

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
	process.on(signal, () => shutdownPrisma(signal));
});

process.on("uncaughtException", async (err) => {
	console.error("Uncaught Exception:", err);
	await prisma.$disconnect();
	process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
	console.error("Unhandled Rejection:", reason);
	await prisma.$disconnect();
	process.exit(1);
});

export default prisma;
