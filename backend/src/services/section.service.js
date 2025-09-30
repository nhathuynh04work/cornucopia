import {
	addNewSection,
	getLastSectionOfTest,
} from "../repositories/section.repository.js";

export async function addNewSectionService({ testId }) {
	// Step 1: Get the last section of the test
	const lastSection = await getLastSectionOfTest(testId);

	// Step 2: Calculate the order of the new section
	const nextOrder = lastSection ? lastSection.sortOrder + 1 : 1;

	// Step 3: Create new section
	const newSection = await addNewSection(undefined, {
		testId,
		title: "Default",
		sortOrder: nextOrder,
	});

	return newSection;
}
