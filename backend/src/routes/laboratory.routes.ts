import { Router } from "express";
import { obtenerLaboratorios } from "../controllers/laboratory.controller";

const router = Router();

router.get("/laboratorios", obtenerLaboratorios);

export default router;