import { Router } from "express";
import * as testController from "../controllers/test.controller.js";

const router = Router();

router.get("/", testController.getTestsController);
router.post("/", testController.createTestController);
router.get("/:id", testController.getTestLiteController);
router.get("/:id/details", testController.getTestDetailsController);

export default router;
