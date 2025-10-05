import prisma from "../prisma.js";
import {
	createGroup,
	createQuestion,
	getItemById,
	getLastItemOfSection,
	getLastQuestionOfGroup,
} from "../repositories/item.repository.js";
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

export async function addItemService({
	sectionId,
	type,
	questionType,
	parentItemId,
}) {
	// For adding question to group
	if (type === "question" && parentItemId) {
		// If we're adding an item to a group, check if parent item exists and is of type group
		const group = await getItemById(parentItemId);
		if (!group) {
			throw new Error("Group does not exists");
		}

		if (group.type !== "group") {
			throw new Error("Item with id = parentItemId is not of type group");
		}

		const lastQuestion = await getLastQuestionOfGroup(parentItemId);

		return await prisma.$transaction(async (tx) => {
			return await createQuestion(tx, {
				sectionId,
				questionType,
				sortOrder: lastQuestion ? lastQuestion.sortOrder + 1 : 1,
				parentItemId,
			});
		});
	}

	const lastItem = await getLastItemOfSection(sectionId);
	const nextOrder = lastItem ? lastItem.sortOrder + 1 : 1;

	// For adding question to section
	if (type === "question" && !parentItemId) {
		return await prisma.$transaction(async (tx) => {
			return await createQuestion(tx, {
				sectionId,
				questionType,
				sortOrder: nextOrder,
			});
		});
	}

	// For group
	return await prisma.$transaction(async (tx) => {
		return await createGroup(tx, { sectionId, sortOrder: nextOrder });
	});
}
