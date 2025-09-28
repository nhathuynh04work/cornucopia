import { addSingleQuestionService } from "../services/question.service.js";

export async function addSingleQuestionController(req, res) {
	const { sectionId, questionType } = req.body;
	if (!sectionId || !questionType) {
		return res
			.status(400)
			.json({ error: "Missing section id or question type" });
	}

	const parsedSectionId = Number(sectionId);
	if (Number.isNaN(parsedSectionId)) {
		return res.status(400).json({ error: "Invalid test id" });
	}

	try {
		const { newQuestion, newGroup } = await addSingleQuestionService({
			sectionId: parsedSectionId,
			questionType,
		});

		res.status(201).json({ group: newGroup, question: newQuestion });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}
