import bcrypt from "bcrypt";
import { Provider, Role } from "../src/generated/prisma/index.js";
import prisma from "../src/prisma.js";

async function main() {
	console.log("Seeding database...");

	// Check if any user exists
	const userCount = await prisma.user.count();
	if (userCount > 0) {
		console.log("Users already exist, skipping admin creation.");
		return;
	}

	// Hash password
	const passwordHash = await bcrypt.hash("khangnghinhat123456@", 10);

	// Create admin user
	const admin = await prisma.user.create({
		data: {
			email: "cornucopia@admin.com",
			role: Role.ADMIN,
			name: "Admin",
			isActive: true,
			authentication: {
				create: {
					provider: Provider.LOCAL,
					passwordHash,
				},
			},
		},
	});

	const topic = await prisma.topic.create({
		data: {
			name: "Chung",
			slug: "Chung",
			description: "Default topic for uncategorized posts",
		},
	});

	console.log("Admin created: ", admin.email);
}

main()
	.catch((e) => {
		console.error("Seed failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
