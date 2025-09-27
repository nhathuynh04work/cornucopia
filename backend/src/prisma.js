import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export default prisma;
