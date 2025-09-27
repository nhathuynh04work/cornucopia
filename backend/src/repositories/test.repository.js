import prisma from "../prisma.js";

export async function getTestById(testId) {}

export async function listTests() {
	return await prisma.test.findMany();
}

export async function addNewTest(client, { title, description }) {
	const newTest = await client.test.create({
		data: { title, description },
	});

	return newTest;
}
