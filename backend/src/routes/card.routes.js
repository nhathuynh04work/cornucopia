import { Router } from "express";
import {
    deleteCardController,
} from "../controllers/card.controller.js"

const router = Router();

router.delete("/:cardId", deleteCardController);
export default router;