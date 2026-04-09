import { Router } from "express";
import { crearAuxiliar, obtenerAuxiliares } from "../controllers/user.controller";
import { crearAdmin } from "../controllers/user.controller";
const router = Router();

router.post("/auxiliares", crearAuxiliar);
router.get("/auxiliares", obtenerAuxiliares);
router.post("/admin", crearAdmin);
export default router;