import { createTest, getTestLite, getTests } from "../services/test.service.js";

export async function getTestsController(req, res) {
	try {
		const tests = await getTests();
		res.status(200).json({ tests });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}

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

export async function getTestLiteController(req, res) {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		return res.status(400).json({ error: "Invalid test id" });
	}

	try {
		const test = await getTestLite({ id });

		if (!test) {
			return res.status(404).json({ error: "Test not found" });
		}

		res.status(200).json({ test });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}

export async function getTestDetailsController(req, res) {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		return res.status(400).json({ error: "Invalid test id" });
	}
}
