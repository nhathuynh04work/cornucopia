import { createNormalGroupService } from "../services/group.service.js";

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
