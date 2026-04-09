// routes/auth.routes.ts
import { Router } from "express";
import { loginAdmin,loginAux } from "../controllers/auth.controller";

const router = Router();

router.post("/login/admin", loginAdmin);
router.post("/login/aux", loginAux);
export default router;