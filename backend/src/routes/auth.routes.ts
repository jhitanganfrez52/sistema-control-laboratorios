import { Router } from "express";

import { login ,logout} from "../controllers/auth.controller";

const router = Router();

// LOGIN
router.post("/login", login);
router.post("/logout", logout);
export default router;