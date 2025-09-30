import {
	addQuestionToGroupService,
	createNormalGroupService,
	deleteGroupService,
} from "../services/group.service.js";

export async function createNormalGroupController(req, res) {
	const { sectionId } = req.body;
	if (!sectionId) {
		return res.status(400).json({ error: "Missing section id" });
	}

	const parsedSectionId = Number(sectionId);
	if (Number.isNaN(parsedSectionId)) {
		return res.status(400).json({ error: "Invalid section id" });
	}

	try {
		const newGroup = await createNormalGroupService({
			sectionId: parsedSectionId,
		});

		res.status(201).json({ group: newGroup });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}

export async function addQuestionToGroupController(req, res) {
	const groupId = Number(req.params.id);
	const { questionType } = req.body;

	if (Number.isNaN(groupId)) {
		return res.status(404).json({ error: "Invalid group id" });
	}

	if (!questionType) {
		return res.status(404).json({ error: "Missing question type" });
	}

	try {
		const newQuestion = await addQuestionToGroupService({
			groupId,
			questionType,
		});

		res.status(201).json({ question: newQuestion });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}

export async function deleteGroupController(req, res) {
	const groupId = Number(req.params.id);

	if (Number.isNaN(groupId)) {
		return res.status(400).json({ error: "Invalid group id" });
	}

	try {
		const success = await deleteGroupService({ groupId });

		if (success) {
			return res.status(204).end();
		} else {
			return res.status(404).json({ error: "Group not found" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}
