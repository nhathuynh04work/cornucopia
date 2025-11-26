import prisma from "../prisma.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";
import { TestItemType, TestStatus } from "../generated/prisma/index.js";
import { indexTest } from "../chatbot/indexer.js";

const getTests = async ({ search, sort, isPublic, userId }) => {
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
};

const getAttemptedTests = async (userId, { search, sort } = {}) => {
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
        },
      ],
    },
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

const updateTest = async (id, data, userId) => {
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

  const updated = await prisma.test.update({
    where: { id },
    data,
  });
  indexTest(updated.id);

  return updated;
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

  await prisma.test.delete({ where: { id: testId } });
};

const addItem = async (testId, data, userId) => {
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

  const item = await prisma.testItem.create({ data: payload });

  indexTest(test.id);

  return item;
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
};

export const testService = {
  getTests,
  getAttemptedTests,
  createTest,
  getTestForInfoView,
  getTestForEdit,
  getTestForAttempt,
  updateTest,
  deleteTest,
  addItem,
  getAnswersKey,
  getTestWithoutAnswer,
};
