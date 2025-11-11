import { Router } from "express";
import * as itemController from "../controllers/item.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

router.use(authenticateJWT, requireRole(Role.CREATOR, Role.ADMIN));

router.patch("/:id", validateParams(["id"]), itemController.updateItem);
router.delete("/:id", validateParams(["id"]), itemController.deleteItem);
router.post("/:id/options", validateParams(["id"]), itemController.addOption);

export default router;
