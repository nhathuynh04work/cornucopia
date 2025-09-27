import prisma from "../prisma.js";

export async function getAllTests() {
	return await prisma.test.findMany();
}

export async function addNewTest(client, { title, description }) {
	const newTest = await client.test.create({
		data: { title, description },
	});

	return newTest;
}

export async function getTestByIdLite(id) {
	return await prisma.test.findUnique({
		where: {
			id,
		},
	});
}

export async function getTestByIdWithDetails(id) {}
