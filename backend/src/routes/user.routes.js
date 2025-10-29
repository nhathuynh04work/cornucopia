import { Router } from "express";
import { getStudyStatistic, getYearlyStudyStatistic } from "../controllers/session.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/study-statistics", authenticateJWT, getStudyStatistic);
router.get("/study-statistics/yearly", authenticateJWT, getYearlyStudyStatistic);

export default router;
