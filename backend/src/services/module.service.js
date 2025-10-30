import * as moduleRepo from "../repositories/module.repository.js";
import { NotFoundError } from "../utils/AppError.js";

export async function remove(id) {
	const module = moduleRepo.findById(id);
	if (!module) throw new NotFoundError("Module not found");
    
	await moduleRepo.remove(id);
}
