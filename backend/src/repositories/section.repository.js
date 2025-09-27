import { TestSection } from "../models/index.js";

export async function addNewSection(
	transaction,
	{ testId, sectionTitle, sectionOrder }
) {
	const newSection = await TestSection.create(
		{
			test_id: testId,
			title: sectionTitle,
			sort_order: sectionOrder,
		},
		{ transaction }
	);

	return newSection.toJSON();
}
