import { withTransactionSequelize } from "../db/transaction.js";
import { addNewSection } from "../repositories/section.repository.js";
import { addNewTest } from "../repositories/test.repository.js";

export async function createTest({ testTitle, testDesc }) {
	return withTransactionSequelize(async (transaction) => {
		const newTest = await addNewTest(transaction, {
			testTitle,
			testDesc,
		});

		const newSection = await addNewSection(transaction, {
			testId: newTest.id,
			sectionTitle: "Default",
			sectionOrder: 1,
		});

		return {
			id: newTest.id,
			title: newTest.title,
			description: newTest.description,
			timeLimit: newTest.time_limit,
			sections: [
				{
					id: newSection.id,
					title: newSection.title,
					sortOrder: newSection.sort_order,
				},
			],
		};
	});
}
