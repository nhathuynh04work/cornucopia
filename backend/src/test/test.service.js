import prisma from "../prisma.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";
import { TestItemType, TestStatus } from "../generated/prisma/index.js";
import { indexTest } from "../chatbot/indexer.js";
import { promoteFile, deleteFile } from "../utils/fileManager.js";

const updateTestQuestionCount = async (testId, tx = prisma) => {
	const count = await tx.testItem.count({
		where: { testId, type: { not: TestItemType.GROUP } },
	});
	await tx.test.update({
		where: { id: testId },
		data: { questionsCount: count },
	});
};

const getTests = async ({
	search,
	sort,
	status,
	userId,
	page = 1,
	limit = 10,
	level,
	language,
}) => {
	const where = {};

	if (status) {
		where.status = status;
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

	if (level && level.length > 0 && !level.includes("ALL_LEVELS")) {
		where.level = { in: level };
	}

	if (language && language.length > 0) {
		where.language = { in: language };
	}

	let orderBy = { createdAt: "desc" };
	if (sort === "oldest") {
		orderBy = { createdAt: "asc" };
	} else if (sort === "attempts") {
		orderBy = { attemptsCount: "desc" };
	}

	const skip = (page - 1) * limit;

	const [tests, totalItems] = await Promise.all([
		prisma.test.findMany({
			where,
			orderBy,
			skip,
			take: limit,
			include: {
				user: {
					select: { id: true, name: true, avatarUrl: true },
				},
			},
		}),
		prisma.test.count({ where }),
	]);

	return {
		data: tests,
		pagination: {
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
			currentPage: page,
		},
	};
};

const getAttemptedTests = async (
	userId,
	{ search, sort, page = 1, limit = 10 }
) => {
	const where = { userId };

	if (search) {
		where.test = {
			title: {
				contains: search,
				mode: "insensitive",
			},
		};
	}

	let orderBy = { createdAt: "desc" };
	if (sort === "oldest") {
		orderBy = { createdAt: "asc" };
	}

	const skip = (page - 1) * limit;

	const [attempts, totalItems] = await Promise.all([
		prisma.attempt.findMany({
			where,
			include: {
				test: {
					select: {
						id: true,
						title: true,
						questionsCount: true,
						timeLimit: true,
						status: true,
					},
				},
			},
			orderBy,
			skip,
			take: limit,
		}),
		prisma.attempt.count({ where }),
	]);

	const mappedAttempts = attempts.map((attempt) => ({
		...attempt,
		date: attempt.createdAt,
	}));

	return {
		tests: mappedAttempts,
		pagination: {
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
			currentPage: Number(page),
		},
	};
};

const createTest = async (userId) => {
	const payload = {
		...defaults.TEST,
		userId,
		items: {
			create: [
				{
					type: TestItemType.SHORT_ANSWER,
					text: "Thủ đô của nước Pháp?",
					answer: "Paris",
					sortOrder: 0,
					// Default empty mediaUrls
					mediaUrls: [],
				},
			],
		},
		questionsCount: 1,
		attemptsCount: 0,
	};

	const test = await prisma.test.create({ data: payload });
	indexTest(test.id);

	return test;
};

const getTestForInfoView = async (id) => {
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
};

const getTestForEdit = async (testId, userId) => {
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
						},
					},
				},
			},

			_count: { select: { attempts: true } },
		},
	});
};

const getTestForAttempt = async (testId) => {
	const test = await getTestWithoutAnswer(testId);

	if (!test) {
		throw new NotFoundError("Test not found");
	}

	if (test.status !== TestStatus.PUBLIC) {
		throw new BadRequestError("Cannot attempt on non-public test");
	}

	return test;
};

const deleteTest = async (testId, userId) => {
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

	if (test.audioUrl) {
		deleteFile(test.audioUrl);
	}

	const allItems = await prisma.testItem.findMany({
		where: { testId },
		select: { mediaUrls: true },
	});

	allItems.forEach((item) => {
		if (item.mediaUrls && item.mediaUrls.length > 0) {
			item.mediaUrls.forEach((url) => deleteFile(url));
		}
	});

	await prisma.test.delete({ where: { id: testId } });
};

const getAnswersKey = async (testId) => {
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
};

const getTestWithoutAnswer = async (testId) => {
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
						},
						omit: { answer: true },
					},
				},
			},
		},
	});
};

const syncAnswerOptions = async (itemId, options, client = prisma) => {
	if (!options) return;

	const existing = await client.answerOption.findMany({
		where: { itemId },
		select: { id: true },
	});

	const existingIds = existing.map((o) => o.id);
	const incomingIds = options.map((o) => o.id).filter(Boolean);

	const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
	if (toDelete.length > 0) {
		await client.answerOption.deleteMany({
			where: { id: { in: toDelete } },
		});
	}

	for (let i = 0; i < options.length; i++) {
		const opt = options[i];
		const payload = {
			text: opt.text,
			isCorrect: opt.isCorrect,
			sortOrder: i,
		};

		if (opt.id) {
			await client.answerOption.update({
				where: { id: opt.id },
				data: payload,
			});
		} else {
			await client.answerOption.create({
				data: { ...payload, itemId },
			});
		}
	}
};

const syncItems = async (
	testId,
	items,
	parentItemId = null,
	client = prisma
) => {
	if (!items) return;

	const existingItems = await client.testItem.findMany({
		where: {
			testId,
			parentItemId,
		},
		select: { id: true },
	});
	const existingIds = existingItems.map((i) => i.id);

	const incomingIds = items
		.map((i) => i.id)
		.filter((id) => id !== undefined && id !== null);

	const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
	if (toDelete.length > 0) {
		const itemsToDelete = await client.testItem.findMany({
			where: {
				OR: [
					{ id: { in: toDelete } },
					{ parentItemId: { in: toDelete } },
				],
			},
			select: { mediaUrls: true },
		});

		itemsToDelete.forEach((item) => {
			if (item.mediaUrls) {
				item.mediaUrls.forEach((url) => deleteFile(url));
			}
		});

		await client.testItem.deleteMany({
			where: { id: { in: toDelete } },
		});
	}

	for (let i = 0; i < items.length; i++) {
		const item = items[i];

		// 1. Handle Media Files (Promote & Cleanup)
		let finalMediaUrls = [];
		if (item.mediaUrls && Array.isArray(item.mediaUrls)) {
			// A. Promote: Move any 'tmp/' files to 'test-items/'
			finalMediaUrls = await Promise.all(
				item.mediaUrls.map((url) => promoteFile(url, "test-items"))
			);

			// B. Cleanup: If updating, check for removed files
			if (item.id) {
				const currentItem = await client.testItem.findUnique({
					where: { id: item.id },
					select: { mediaUrls: true },
				});

				if (currentItem?.mediaUrls) {
					// Any URL in DB that is NOT in the new list -> Delete it
					const removedUrls = currentItem.mediaUrls.filter(
						(oldUrl) => !finalMediaUrls.includes(oldUrl)
					);
					removedUrls.forEach((url) => deleteFile(url));
				}
			}
		}

		// Common data for both create and update
		const baseItemData = {
			type: item.type,
			text: item.text,
			points: item.points,
			answer: item.answer,
			sortOrder: i,
			mediaUrls: finalMediaUrls,
		};

		let currentItemId = item.id;

		if (currentItemId) {
			await client.testItem.update({
				where: { id: currentItemId },
				data: baseItemData,
			});
		} else {
			const newItem = await client.testItem.create({
				data: {
					...baseItemData,
					testId,
					parentItemId,
				},
			});
			currentItemId = newItem.id;
		}

		if (item.type === TestItemType.MULTIPLE_CHOICE && item.answerOptions) {
			await syncAnswerOptions(currentItemId, item.answerOptions, client);
		}

		if (item.type === TestItemType.GROUP && item.children) {
			await syncItems(testId, item.children, currentItemId, client);
		}
	}
};

const syncTest = async ({ testId, data, userId }, client = prisma) => {
	const test = await client.test.findFirst({
		where: { id: testId, userId },
	});

	if (!test) {
		throw new ForbiddenError("You have no permission to edit this test");
	}

	const performSync = async (tx) => {
		let finalAudioUrl = data.audioUrl;
		if (data.audioUrl && data.audioUrl.includes("/tmp/")) {
			finalAudioUrl = await promoteFile(data.audioUrl, "tests/audio");

			if (test.audioUrl && test.audioUrl !== finalAudioUrl) {
				deleteFile(test.audioUrl);
			}
		} else if (data.audioUrl === null && test.audioUrl) {
			deleteFile(test.audioUrl);
		}

		const updated = await tx.test.update({
			where: { id: testId },
			data: {
				title: data.title,
				description: data.description,
				status: data.status,
				timeLimit: data.timeLimit,
				audioUrl: finalAudioUrl,
				level: data.level,
				language: data.language,
			},
		});

		if (data.items) {
			await syncItems(testId, data.items, null, tx);
			await updateTestQuestionCount(testId, tx);
		}

		indexTest(updated.id);
		return updated;
	};

	if (typeof client.$transaction === "function") {
		return client.$transaction(performSync, {
			maxWait: 5000,
			timeout: 20000,
		});
	} else {
		return performSync(client);
	}
};

export const testService = {
	getTests,
	getAttemptedTests,
	createTest,
	getTestForInfoView,
	getTestForEdit,
	getTestForAttempt,
	deleteTest,
	getAnswersKey,
	getTestWithoutAnswer,
	syncTest,
};
