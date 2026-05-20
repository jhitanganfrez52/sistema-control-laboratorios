import { Request, Response } from "express";
import session from "express-session";

import bcrypt from "bcryptjs";

import { User } from "../models/User";
import { Role } from "../models/Role";

interface SessionRequest extends Request {
  session: session.Session & {
    usuario?: {
      id_usuario: number;
      id_rol: number;
    };
  };
}

export const login = async (req: SessionRequest, res: Response) => {
  try {
    const { codigo_acceso, password } = req.body;

    console.log("CODIGO:", codigo_acceso);
    console.log("PASSWORD:", password);

    const user = await User.findOne({
      where: {
        codigo_acceso,
      },

      include: [Role],
    });

    console.log("USUARIO:", user);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    console.log("HASH DB:", user.password);

    const passwordCorrecta = await bcrypt.compare(password, user.password);

    console.log("COMPARE:", passwordCorrecta);

    if (!passwordCorrecta) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    req.session.usuario = {
      id_usuario: user.id_usuario,
      id_rol: user.id_rol,
    };

    res.json({
      message: "Login correcto",
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error login",
    });
  }
};
export const logout = async (
  req: SessionRequest,
  res: Response
) => {

  req.session.destroy((err) => {

    if (err) {
      return res.status(500).json({
        message: "Error cerrando sesión",
      });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      message: "Sesión cerrada",
    });

  });

};
