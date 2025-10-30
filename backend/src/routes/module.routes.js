import { Router } from "express";
import { validateParams } from "../middlewares/validateParams.js";
import * as moduleController from "../controllers/module.controller.js";

const router = Router();

router.delete("/:id", validateParams(["id"]), moduleController.deleteModule);

export default router;
