import prisma from "../prisma.js";

export async function assignRole(userId, role, client = prisma) {
	return client.userRole.update({
		where: { userId },
		data: { role },
	});
}
