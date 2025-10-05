import { updateTestSchema } from "../schemas/test.schema.js";
import {
	createTestService,
	getTestDetails,
	getTestLite,
	getTests,
	updateTestService,
} from "../services/test.service.js";

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
		return res.status(404).json({ error: "Missing test title" });
	}

	try {
		const newTest = await createTestService({ title, description });
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

	try {
		const test = await getTestDetails({ id });

		if (!test) {
			return res.status(404).json({ test });
		}

		res.status(200).json({ test });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
}

export async function updateTestController(req, res) {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		return res.status(400).json({ error: "Test ID must be a number" });
	}

	const parsed = updateTestSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({
			error: "Invalid input",
			details: parsed.error,
		});
	}

	try {
		const updated = await updateTestService(id, parsed.data);
		res.status(200).json({ test: updated });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
}
