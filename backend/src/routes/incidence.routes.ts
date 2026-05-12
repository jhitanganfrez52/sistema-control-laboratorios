import { Router } from "express";
import { crearIncidencia,obtenerIncidencias, } from "../controllers/incidence.controller";

const router = Router();

router.post("/incidencias", crearIncidencia);
router.get("/incidencias", obtenerIncidencias);
export default router;