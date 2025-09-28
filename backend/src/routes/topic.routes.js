import { Router } from "express";
import { listTopicsController } from "../controllers/topic.controller.js";

const router = Router();

router.get("/", listTopicsController); // GET /api/topics

export default router;
