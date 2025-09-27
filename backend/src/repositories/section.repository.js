export async function addNewSection(client, { testId, title, sortOrder }) {
	const newSection = await client.testSection.create({
		data: {
			testId,
			title,
			sortOrder,
		},
	});

	return newSection;
}
