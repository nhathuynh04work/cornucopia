import { createTest } from "../services/test.service.js";

export async function createTestController(req, res) {
	const { testTitle, testDesc } = req.body;
	if (!testTitle) {
		return res.status(404).json({ message: "Missing test title" });
	}

	try {
		const newTest = await createTest({ testTitle, testDesc });

		res.status(201).json({ message: "New test created", test: newTest });
	} catch (err) {
		res.status(500).json({ error: err.error });
	}
}
