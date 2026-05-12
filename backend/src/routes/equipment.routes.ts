import { Router } from "express";
import {
  crearEquipo,
  obtenerEquipos,
} from "../controllers/equipment.controller";

const router = Router();

router.post("/equipos", crearEquipo);
router.get("/equipos", obtenerEquipos);

export default router;