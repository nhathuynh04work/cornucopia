import {
	createSection,
	deleteSection,
	getLastSectionOfTest,
} from "../repositories/section.repository.js";

export async function addNewSectionService({ testId }) {
	// Step 1: Get the last section of the test
	const lastSection = await getLastSectionOfTest(testId);

	// Step 2: Calculate the order of the new section
	const nextOrder = lastSection ? lastSection.sortOrder + 1 : 1;

	// Step 3: Create new section
	const newSection = await createSection(undefined, {
		testId,
		sortOrder: nextOrder,
	});

	return newSection;
}

export async function deleteSectionService({ sectionId }) {
	await prisma.$transaction(async (tx) => {
		const count = await countGroupsOfSection(sectionId, tx);

		if (count > 0) {
			throw new Error("Cannot delete a group that still has questions");
		}

		await deleteSection(tx, { id: sectionId });
	});

	return true;
}
