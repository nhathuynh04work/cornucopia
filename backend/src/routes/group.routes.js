import { Router } from "express";
import * as groupController from "../controllers/group.controller.js";

const router = Router();

router.post("/", groupController.createNormalGroupController);

export default router;
