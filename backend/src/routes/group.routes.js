import { Router } from "express";
import * as groupController from "../controllers/group.controller.js";

const router = Router();

router.post("/", groupController.createNormalGroupController);
router.post("/:id/questions", groupController.addQuestionToGroupController);
router.delete("/:id", groupController.deleteGroupController);

export default router;
