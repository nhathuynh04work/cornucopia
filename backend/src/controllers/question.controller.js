import {
	addOptionToQuestionService,
	addSingleQuestionService,
} from "../services/question.service.js";

export async function addSingleQuestionController(req, res) {
	const { sectionId, questionType } = req.body;
	if (!sectionId || !questionType) {
		return res
			.status(400)
			.json({ error: "Missing section id or question type" });
	}

	const parsedSectionId = Number(sectionId);
	if (Number.isNaN(parsedSectionId)) {
		return res.status(400).json({ error: "Invalid section id" });
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

export async function addOptionToQuestionController(req, res) {
	const questionId = Number(req.params.id);

	if (Number.isNaN(questionId)) {
		return res.status(404).json({ error: "Invalid question id" });
	}

	try {
		const newOption = await addOptionToQuestionService({ questionId });
		res.status(201).json({ option: newOption });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}
