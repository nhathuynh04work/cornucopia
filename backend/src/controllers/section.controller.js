import { addNewSectionService } from "../services/section.service.js";

export async function addNewSectionController(req, res) {
	const { testId, title } = req.body;
	if (!testId || !title) {
		return res.status(400).json({ error: "Missing test id or title" });
	}

	const parsedTestId = Number(testId);
	if (Number.isNaN(parsedTestId)) {
		return res.status(400).json({ error: "Invalid test id" });
	}

	try {
		const newSection = await addNewSectionService({
			testId: parsedTestId,
			title,
		});
		res.status(201).json({ section: newSection });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}
