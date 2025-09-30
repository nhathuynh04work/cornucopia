import {
	addNewSectionService,
	deleteSectionService,
} from "../services/section.service.js";

export async function addNewSectionController(req, res) {
	const { testId } = req.body;
	if (!testId) {
		return res.status(400).json({ error: "Missing test id" });
	}

	const parsedTestId = Number(testId);
	if (Number.isNaN(parsedTestId)) {
		return res.status(400).json({ error: "Invalid test id" });
	}

	try {
		const newSection = await addNewSectionService({
			testId: parsedTestId,
		});
		res.status(201).json({ section: newSection });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}

export async function deleteSectionController(req, res) {
	const sectionId = Number(req.params.id);

	if (Number.isNaN(sectionId)) {
		return res.status(400).json({ error: "Invalid section id" });
	}

	try {
		const success = await deleteSectionService({ sectionId });

		if (success) {
			return res.status(204).end();
		} else {
			return res.status(404).json({ error: "Section not found" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}
