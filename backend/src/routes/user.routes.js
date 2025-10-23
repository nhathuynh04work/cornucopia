import { Router } from "express";
import { getStudyStatistic } from "../controllers/session.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/study-statistics", authenticateJWT, getStudyStatistic);

export default router;
