import { Router } from "express";
import * as testController from "../controllers/test.controller.js";

const router = Router();

router.post("/", testController.createTestController);

export default router;
