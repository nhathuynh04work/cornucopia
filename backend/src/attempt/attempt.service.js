import { testService } from "../test/test.service.js";
import { NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";
import { areSetsEqual } from "../utils/compare.js";
import { TestItemType } from "../generated/prisma/index.js";
import prisma from "../prisma.js";

const createAttempt = async (data) => {
	const { answers, ...attemptData } = data;
	const answerKey = await testService.getAnswersKey(attemptData.testId);

	let correctCount = 0,
		wrongCount = 0,
		unansweredCount = 0,
		scoredPoints = 0,
		totalPossiblePoints = 0;

	for (const submittedAnswer of answers) {
		const correctAnswer = answerKey[submittedAnswer.questionId];
		totalPossiblePoints += correctAnswer.points;

		// unanswered
		if (
			submittedAnswer.text === "" &&
			submittedAnswer.optionIds.length === 0
		) {
			unansweredCount++;
			continue;
		}

		const isCorrect = gradeAnswer(submittedAnswer, correctAnswer);

		// correct
		if (isCorrect) {
			correctCount++;
			scoredPoints += correctAnswer.points;
			continue;
		}

		wrongCount++; // wrong
	}

	return prisma.$transaction(async (tx) => {
		const attempt = await tx.attempt.create({
			data: {
				...attemptData,
				correctCount,
				wrongCount,
				unansweredCount,
				scoredPoints,
				totalPossiblePoints,
				answers: {
					create: answers,
				},
			},
		});

		await tx.test.update({
			where: { id: attemptData.testId },
			data: {
				attemptsCount: {
					increment: 1,
				},
			},
		});

		return attempt;
	});
};

const getResult = async (id) => {
	const attempt = await prisma.attempt.findUnique({
		where: { id },
		include: { answers: true },
	});
	if (!attempt) throw new NotFoundError(errorMessage.ATTEMPT_NOT_FOUND);

	const test = await testService.getTestWithoutAnswer(attempt.testId);
	if (!test) throw new NotFoundError(errorMessage.TEST_NOT_FOUND);

	const answerKey = await testService.getAnswersKey(attempt.testId);

	const resultsMap = {};
	for (const submittedAnswer of attempt.answers) {
		const correctAnswer = answerKey[submittedAnswer.questionId];
		const isCorrect = gradeAnswer(submittedAnswer, correctAnswer);

		resultsMap[submittedAnswer.questionId] = {
			isCorrect: isCorrect,
			questionPoints: correctAnswer.points,
			scoredPoints: isCorrect ? correctAnswer.points : 0,
			submitted: {
				text: submittedAnswer.text,
				optionIds: submittedAnswer.optionIds,
			},
			correct: {
				text: correctAnswer.answer,
				optionIds: correctAnswer.optionIds,
			},
		};
	}

	function injectResults(items) {
		if (!items || items.length === 0) return;

		items.forEach((item) => {
			const result = resultsMap[item.id];
			if (result) {
				// Attach the result directly to the item
				item.result = result;
			}
			// Recurse into children
			if (item.children) {
				injectResults(item.children);
			}
		});
	}

	injectResults(test.items);

	return {
		test: test,
		attemptId: attempt.id,
		timeTaken: attempt.time,
		createdAt: attempt.createdAt,
		scoredPoints: attempt.scoredPoints,
		totalPossiblePoints: attempt.totalPossiblePoints,
		correctCount: attempt.correctCount,
		wrongCount: attempt.wrongCount,
		unansweredCount: attempt.unansweredCount,
	};
};

const getUserAttemptsOnTest = async (testId, userId) => {
	return prisma.attempt.findMany({
		where: { testId, userId },
		include: { test: { select: { title: true } } },
		orderBy: { createdAt: "desc" },
	});
};

function gradeAnswer(submittedAnswer, correctAnswer) {
	const { type } = correctAnswer;

	if (type === TestItemType.SHORT_ANSWER) {
		const submitted = submittedAnswer.text?.trim().toLowerCase();
		const correct = correctAnswer.answer?.trim().toLowerCase();
		return submitted === correct;
	}

	if (type === TestItemType.MULTIPLE_CHOICE) {
		const submittedSet = new Set(submittedAnswer.optionIds);
		const correctSet = new Set(correctAnswer.optionIds);
		return areSetsEqual(submittedSet, correctSet);
	}

	return false;
}

export const attemptService = {
	createAttempt,
	getResult,
	getUserAttemptsOnTest,
};
