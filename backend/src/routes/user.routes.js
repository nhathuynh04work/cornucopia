import { Router } from "express";
import { getStudyStatistic, getYearlyStudyStatistic } from "../controllers/session.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { updateUserBasicInfo } from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const router = Router();

router.get("/study-statistics", authenticateJWT, getStudyStatistic);
router.get("/study-statistics/yearly", authenticateJWT, getYearlyStudyStatistic);

router.patch("/basic-infos", authenticateJWT, updateUserBasicInfo);

export default router;
