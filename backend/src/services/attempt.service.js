import * as attemptRepo from "../repositories/attempt.repository.js";
import * as testRepo from "../repositories/test.repository.js";
import * as testService from "../services/test.service.js";
import { NotFoundError } from "../utils/AppError.js";
import { errorMessage, itemTypeEnum } from "../utils/constants.js";
import { areSetsEqual } from "../utils/compare.js";

// data: { userId, testId, time, answers }
export async function createAttempt(data) {
	const { answers: answersData, ...attemptData } = data;
	return attemptRepo.create(attemptData, answersData);
}

export async function getResult(id) {
	const attempt = await attemptRepo.findById(id);
	if (!attempt) throw new NotFoundError(errorMessage.ATTEMPT_NOT_FOUND);

	const test = await testRepo.getTestWithoutAnswer(attempt.testId);
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
				// Attach the result directly to the item!
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
		test: test, // The full test object with results
		attemptId: attempt.id,
		timeTaken: attempt.time,
		createdAt: attempt.createdAt,
	};
}

function gradeAnswer(submittedAnswer, correctAnswer) {
	const { type } = correctAnswer;

	if (type === itemTypeEnum.SHORT_ANSWER) {
		const submitted = submittedAnswer.text?.trim().toLowerCase();
		const correct = correctAnswer.answer?.trim().toLowerCase();
		return submitted === correct;
	}

	if (type === itemTypeEnum.MULTIPLE_CHOICE) {
		const submittedSet = new Set(submittedAnswer.optionIds);
		const correctSet = new Set(correctAnswer.optionIds);
		return areSetsEqual(submittedSet, correctSet);
	}

	return false;
}
