import { Router } from "express";
import * as sectionController from "../controllers/section.controller.js";

const router = Router();

router.post("/", sectionController.addNewSectionController);

export default router;
