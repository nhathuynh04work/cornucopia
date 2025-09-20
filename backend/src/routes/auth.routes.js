import {Router} from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post("/signup", authController.localSignup);
router.post("/login", authController.localLogin);

export default router;