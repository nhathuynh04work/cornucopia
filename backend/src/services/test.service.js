import prisma from "../prisma.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";
import { TestItemType, TestStatus } from "../generated/prisma/index.js";

export async function getTests({ search, sort, isPublic, userId }) {
	const where = {};

	if (isPublic) {
		where.status = TestStatus.PUBLIC;
	}

	if (userId) {
		where.userId = userId;
	}

	if (search) {
		where.title = {
			contains: search,
			mode: "insensitive",
		};
	}

	let orderBy = { createdAt: "desc" };
	if (sort === "oldest") {
		orderBy = { createdAt: "asc" };
	}

	return prisma.test.findMany({
		where,
		orderBy,
		include: {
			_count: {
				select: {
					attempts: true,
					items: { where: { type: { not: TestItemType.GROUP } } },
				},
			},

			user: {
				select: { id: true, name: true, avatarUrl: true },
			},
		},
	});
}

export async function getAttemptedTests(userId, { search, sort } = {}) {
	const where = {
		attempts: {
			some: {
				userId: userId,
			},
		},
	};

	if (search) {
		where.title = {
			contains: search,
			mode: "insensitive",
		};
	}

	let orderBy = { createdAt: "desc" };
	if (sort === "oldest") {
		orderBy = { createdAt: "asc" };
	}

	return prisma.test.findMany({
		where,
		orderBy,
		include: {
			_count: {
				select: {
					attempts: true,
					items: { where: { type: { not: TestItemType.GROUP } } },
				},
			},
			user: {
				select: { id: true, name: true, avatarUrl: true },
			},
		},
	});
}

export async function createTest(userId) {
	const payload = {
		...defaults.TEST,
		userId,
		items: {
			create: [
				{
					type: TestItemType.SHORT_ANSWER,
					text: "Thủ đô của nước Pháp?",
					answer: "Paris",
				},
			],
		},
	};

	return prisma.test.create({ data: payload });
}

export async function getTestForInfoView(id) {
	const test = await prisma.test.findUnique({
		where: { id },
		include: {
			_count: {
				select: {
					items: {
						where: {
							type: {
								not: TestItemType.GROUP,
							},
						},
					},
					attempts: true,
				},
			},
			user: true,
		},
	});

	if (!test) {
		throw new NotFoundError("Test not found");
	}

	return test;
}

export async function getTestForEdit(testId, userId) {
	const test = await prisma.test.findFirst({
		where: { id: testId, userId },
	});

	if (!test) {
		throw new ForbiddenError("You have no permission to edit this test");
	}

	return prisma.test.findUnique({
		where: { id: testId },
		include: {
			items: {
				where: { parentItemId: null },
				orderBy: { sortOrder: "asc" },
				include: {
					answerOptions: {
						orderBy: { sortOrder: "asc" },
					},
					children: {
						orderBy: { sortOrder: "asc" },
						include: {
							answerOptions: {
								orderBy: { sortOrder: "asc" },
							},
							media: true,
						},
					},
					media: true,
				},
			},
			media: true,
			_count: { select: { attempts: true } },
		},
	});
}

export async function getTestForAttempt(testId) {
	const test = await getTestWithoutAnswer(testId);

	if (!test) {
		throw new NotFoundError("Test not found");
	}

	if (test.status !== TestStatus.PUBLIC) {
		throw new BadRequestError("Cannot attempt on non-public test");
	}

	return test;
}

export async function updateTest(id, data, userId) {
	const test = await prisma.test.findFirst({
		where: { id, userId },
	});

	if (!test) {
		throw new ForbiddenError("You have no permission to edit this test");
	}

	if (data?.status === TestStatus.DRAFT && data.status !== test.status) {
		throw new ForbiddenError(
			"Cannot make this test a draft. Try archiving it instead"
		);
	}

	return prisma.test.update({
		where: { id },
		data,
	});
}

export async function deleteTest(testId, userId) {
	const test = await prisma.test.findFirst({
		where: { id: testId, userId },
		include: { _count: { select: { attempts: true } } },
	});

	if (!test) {
		throw new ForbiddenError("You have no permission to delete this test");
	}

	if (test._count.attempts > 0) {
		throw new ForbiddenError(
			"Cannot delete test other users have taken. Try archiving it instead"
		);
	}

	await prisma.test.delete({ where: { id: testId } });
}

export async function addItem(testId, data, userId) {
	const test = await prisma.test.findUnique({
		where: { id: testId, userId },
	});

	if (!test) {
		throw new ForbiddenError("You have no permission to edit this test");
	}

	const payload = { ...data, testId };

	switch (data.type) {
		case TestItemType.MULTIPLE_CHOICE:
			payload.answerOptions = {
				create: {
					text: defaults.OPTION_TEXT,
					isCorrect: true,
				},
			};
			break;
		case TestItemType.GROUP:
			payload.children = {
				create: {
					testId: testId,
					type: TestItemType.SHORT_ANSWER,
					text: defaults.QUESTION_TEXT,
				},
			};
			break;
	}

	return prisma.testItem.create({ data: payload });
}

export async function getAnswersKey(testId) {
	const test = await prisma.test.findUnique({
		where: { id: testId },
		include: {
			items: {
				where: {
					type: { not: TestItemType.GROUP },
				},
				include: {
					answerOptions: true,
				},
			},
		},
	});

	if (!test) throw new NotFoundError("Test not found");

	const questions = test.items;
	const answerKey = {};

	questions.forEach((question) => {
		const correctOptionIds =
			question.type === TestItemType.MULTIPLE_CHOICE
				? question.answerOptions
						.filter((option) => option.isCorrect)
						.map((option) => option.id)
				: [];

		answerKey[question.id] = {
			type: question.type,
			answer: question.answer,
			optionIds: correctOptionIds,
			points: question.points,
		};
	});

	return answerKey;
}

export async function getTestWithoutAnswer(testId) {
	return prisma.test.findFirst({
		where: { id: testId },
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
