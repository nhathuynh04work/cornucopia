import { Router } from "express";
import * as testController from "../controllers/test.controller.js";

const router = Router();

router.get("/", testController.getTestsController);
router.post("/", testController.createTestController);
router.get("/:id", testController.getTestLiteController);
router.patch("/:id", testController.updateTestController);
router.get("/:id/full", testController.getTestDetailsController);

export default router;
