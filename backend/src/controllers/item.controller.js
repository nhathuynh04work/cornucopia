import { deleteItemService } from "../services/item.service.js";

export async function deleteItemController(req, res) {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		return res.status(400).json({ error: "Invalid id" });
	}

	try {
		const deleted = await deleteItemService({ id });

		if (!deleted) {
			return res.status(404).json({ error: "Item not found" });
		}

		res.status(204).end();
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.error });
	}
}
