import prisma from "../prisma.js";

export async function getTestWithoutAnswer(id, client = prisma) {
	return client.test.findUnique({
		where: { id },
		include: {
			items: {
				where: { parentItemId: null },
				orderBy: { sortOrder: "asc" },
				omit: { answer: true },
				include: {
					answerOptions: {
						orderBy: { sortOrder: "asc" },
						omit: { isCorrect: true },
					},
					children: {
						orderBy: { sortOrder: "asc" },
						include: {
							answerOptions: {
								orderBy: { sortOrder: "asc" },
								omit: { isCorrect: true },
							},
							media: true,
						},
						omit: { answer: true },
					},
					media: true,
				},
			},
			media: true,
		},
	});
}
