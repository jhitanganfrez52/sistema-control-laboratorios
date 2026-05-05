import { Router } from "express";
import { crearAuxiliar, obtenerAuxiliares } from "../controllers/user.controller";
import { crearAdmin } from "../controllers/user.controller";
import { obtenerAdmin } from "../controllers/user.controller";
import { User } from "../models/User";
const router = Router();

router.post("/auxiliares", crearAuxiliar);
router.get("/auxiliares", obtenerAuxiliares);
router.post("/admin", crearAdmin);
router.get("/admin/me", obtenerAdmin);
// routes/user.routes.ts
import { upload } from "../middlewares/upload";

router.post("/upload-photo/:id", upload.single("foto"), async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.foto = req.file?.filename || "";
    await user.save();

    res.json({
      message: "Foto actualizada",
      foto: user.foto,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al subir imagen" });
  }
});
export default router;