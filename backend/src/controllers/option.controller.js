import { deleteOptionService } from "../services/option.service.js";

export async function deleteOptionController(req, res) {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		return res.status(400).json({ error: "Invalid option id" });
	}

	try {
		const success = await deleteOptionService({ id });

		if (success) {
			return res.status(204).end();
		} else {
			return res.status(404).json({ error: "Option not found" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}
