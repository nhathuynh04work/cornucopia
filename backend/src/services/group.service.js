import prisma from "../prisma.js";
import {
	createNormalGroup,
	getLastGroupOfSection,
} from "../repositories/group.repository.js";

export async function createNormalGroupService({ sectionId }) {
	return await prisma.$transaction(async (tx) => {
		// Step 1: Find the last question group of the section
		const lastGroup = await getLastGroupOfSection(sectionId);

		// Step 2: Calculate the order of the next group
		const nextGroupOrder = lastGroup ? lastGroup.sortOrder + 1 : 1;

		// Step 3: Add a group (is single = false)
		const newGroup = await createNormalGroup(tx, {
			sectionId,
			sortOrder: nextGroupOrder,
		});

		return newGroup;
	});
}
