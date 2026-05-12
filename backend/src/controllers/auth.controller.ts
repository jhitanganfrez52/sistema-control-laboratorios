// controllers/auth.controller.ts
import { Request, Response } from "express";
import { User } from "../models/User";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { codigo_acceso, password } = req.body;

    const user = await User.findOne({
      where: { codigo_acceso, password, rol: "ADMINISTRADOR" },
    });
    if (!user) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    res.json({
      message: "Login correcto",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error en login",
    });
  }
};
export const loginAux = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({
      message: "No se envió body",
    });
  }

  const { codigo_acceso } = req.body;

  if (!codigo_acceso) {
    return res.status(400).json({
      message: "Falta codigo_acceso",
    });
  }

  const user = await User.findOne({
    where: {
      codigo_acceso,
      rol: "AUXILIAR",
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "No eres auxiliar",
    });
  }

  res.json({
    rol: user.rol,
    data: user,
  });
};