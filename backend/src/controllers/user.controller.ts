import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { User } from "../models/User";
import { Role } from "../models/Role";

/* =====================================================
   CREAR AUXILIAR
===================================================== */
export const crearAuxiliar = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      nombre_completo,
      codigo_acceso,
      password,
    } = req.body;

    // 🔥 BUSCAR ROL AUXILIAR
    const rolAux = await Role.findOne({
      where: {
        nombre: "AUXILIAR",
      },
    });

    if (!rolAux) {
      return res.status(404).json({
        message: "Rol auxiliar no encontrado",
      });
    }

    // 🔥 HASH PASSWORD
    const passwordHash =
      await bcrypt.hash(password, 10);

    // 🔥 CREAR USUARIO
    const nuevo = await User.create({

      nombre_completo,

      codigo_acceso,

      password: passwordHash,

      id_rol: rolAux.id_rol,

      estado: "ACTIVO",

      fecha_creacion: new Date(),

    });

    res.status(201).json({
      message: "Auxiliar creado correctamente",
      data: nuevo,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error al crear auxiliar",
    });

  }

};

/* =====================================================
   OBTENER AUXILIARES
===================================================== */
export const obtenerAuxiliares = async (
  req: Request,
  res: Response
) => {

  try {

    const rolAux = await Role.findOne({
      where: {
        nombre: "AUXILIAR",
      },
    });

    if (!rolAux) {
      return res.status(404).json({
        message: "Rol auxiliar no encontrado",
      });
    }

    const auxiliares = await User.findAll({

      where: {
        id_rol: rolAux.id_rol,
      },

      include: [Role],

      attributes: [
        "id_usuario",
        "nombre_completo",
        "codigo_acceso",
        "estado",
        "fecha_creacion",
        "foto",
      ],

    });

    res.status(200).json({
      message: "Lista auxiliares",
      data: auxiliares,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error al obtener auxiliares",
    });

  }

};

/* =====================================================
   CREAR ADMIN
===================================================== */
export const crearAdmin = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      nombre,
      apellido,
      codigo_acceso,
      password,
    } = req.body;

    // 🔥 BUSCAR ROL ADMIN
    const rolAdmin = await Role.findOne({
      where: {
        nombre: "ADMINISTRADOR",
      },
    });

    if (!rolAdmin) {
      return res.status(404).json({
        message: "Rol admin no encontrado",
      });
    }

    // 🔥 HASH PASSWORD
    const passwordHash =
      await bcrypt.hash(password, 10);

    // 🔥 CREAR ADMIN
    const nuevo = await User.create({

      nombre_completo:
        `${nombre} ${apellido}`,

      codigo_acceso,

      password: passwordHash,

      id_rol: rolAdmin.id_rol,

      estado: "ACTIVO",

      fecha_creacion: new Date(),

    });

    res.status(201).json({
      message: "Administrador creado",
      data: nuevo,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error al crear admin",
    });

  }

};

/* =====================================================
   OBTENER ADMIN
===================================================== */
export const obtenerAdmin = async (
  req: Request,
  res: Response
) => {

  try {

    const rolAdmin = await Role.findOne({
      where: {
        nombre: "ADMINISTRADOR",
      },
    });

    if (!rolAdmin) {
      return res.status(404).json({
        message: "Rol admin no encontrado",
      });
    }

    const admin = await User.findOne({

      where: {
        id_rol: rolAdmin.id_rol,
      },

      include: [Role],

      attributes: [
        "id_usuario",
        "nombre_completo",
        "codigo_acceso",
        "estado",
        "fecha_creacion",
        "foto",
      ],

    });

    if (!admin) {
      return res.status(404).json({
        message: "No existe admin",
      });
    }

    res.json(admin);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error al obtener admin",
    });

  }

};
/* =====================================================
   OBTENER AUXILIAR LOGUEADO
===================================================== */
export const obtenerPerfilAuxiliar = async (
  req: Request,
  res: Response
) => {

  try {

    const rolAux = await Role.findOne({
      where: {
        nombre: "AUXILIAR",
      },
    });

    if (!rolAux) {
      return res.status(404).json({
        message: "Rol auxiliar no encontrado",
      });
    }

    // 🔥 TEMPORAL
    // luego esto vendrá del login/token
    const auxiliar = await User.findOne({

      where: {
        id_rol: rolAux.id_rol,
      },

      include: [Role],

      attributes: [
        "id_usuario",
        "nombre_completo",
        "codigo_acceso",
        "estado",
        "fecha_creacion",
        "foto",
      ],

    });

    if (!auxiliar) {
      return res.status(404).json({
        message: "No existe auxiliar",
      });
    }

    res.json(auxiliar);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error al obtener auxiliar",
    });

  }

};