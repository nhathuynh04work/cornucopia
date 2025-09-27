import { createTest } from "../services/test.service.js";

export async function createTestController(req, res) {
	const { title, description } = req.body;
	if (!title) {
		return res.status(404).json({ message: "Missing test title" });
	}

	try {
		const newTest = await createTest({ title, description });

		res.status(201).json({ message: "New test created", test: newTest });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}
