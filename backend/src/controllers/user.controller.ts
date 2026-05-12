import { Request, Response } from "express";
import { User } from "../models/User";

export const crearAuxiliar = async (req: Request, res: Response) => {
  try {
    const { nombre_completo, codigo_acceso, password } = req.body;

    const nuevo = await User.create({
      nombre_completo,
      codigo_acceso,
      password,
      rol: "AUXILIAR",
      estado: "ACTIVO",
      fecha_creacion: new Date(),
    });

    res.status(201).json({
      message: "Auxiliar creado correctamente",
      data: nuevo,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear auxiliar",
    });
  }
};
// GET todos los auxiliares (solo campos importantes)
export const obtenerAuxiliares = async (req: Request, res: Response) => {
  try {
    const auxiliares = await User.findAll({
      where: { rol: "AUXILIAR" },
      attributes: ["id_usuario", "nombre_completo", "codigo_acceso", "estado", "fecha_creacion"], // ✅ id_usuario en vez de id
    });

    res.status(200).json({
      message: "Lista de auxiliares",
      data: auxiliares,
    });
  } catch (error) {
    console.error("Error en obtenerAuxiliares:", error);
    res.status(500).json({
      message: "Error al obtener auxiliares",
      error: (error as Error).message, // para debug
    });
  }
};
export const crearAdmin = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, ci, telefono, codigo_acceso, password } = req.body;

    const nuevo = await User.create({
      nombre_completo: `${nombre} ${apellido}`,
      codigo_acceso,
      password,
      rol: "ADMINISTRADOR",
      estado: "ACTIVO",
      fecha_creacion: new Date(),
    });

    res.status(201).json({
      message: "Admin creado correctamente",
      data: nuevo,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear admin",
    });
  }
};
export const obtenerAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await User.findOne({
      where: { rol: "ADMINISTRADOR" },
      attributes: [
        "id_usuario",
        "nombre_completo",
        "codigo_acceso",
        "estado",
        "fecha_creacion",
        "rol",
        "foto", // 🔥 FALTABA ESTO
      ],
    });

    if (!admin) {
      return res.status(404).json({
        message: "No hay admin",
      });
    }

    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener admin",
    });
  }
};