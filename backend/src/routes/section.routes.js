import { Router } from "express";
import * as sectionController from "../controllers/section.controller.js";

const router = Router();

router.post("/", sectionController.addNewSectionController);
router.delete("/:id", sectionController.deleteSectionController);

export default router;
