export async function createQuestion(
	client,
	{ sectionId, text, questionType, sortOrder }
) {
	const question = await client.testItem.create({
		data: {
			sectionId,
			type: "question",
			questionType,
			text,
			sortOrder,
		},
	});

	return question;
}
