import * as attemptRepo from "../repositories/attempt.repository.js";

// data: { userId, testId, time, answers }
export async function createAttempt(data) {
	const { answers: answersData, ...attemptData } = data;
	return attemptRepo.create(attemptData, answersData);
}
