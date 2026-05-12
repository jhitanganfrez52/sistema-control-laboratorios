import { Request, Response } from "express";
import { Incidence } from "../models/Incidence";
import { Equipment } from "../models/Equipment";
import { User } from "../models/User";
import { Laboratory } from "../models/Laboratory";
export const crearIncidencia = async (req: Request, res: Response) => {
  try {
    const {
      id_equipo,
      id_auxiliar,
      fecha,
      turno,
      tipo,
      descripcion,
    } = req.body;

    const incidencia = await Incidence.create({
      id_equipo,
      id_auxiliar,
      fecha,
      turno,
      tipo,
      descripcion,
    });

    res.status(201).json({
      message: "Incidencia registrada",
      data: incidencia,
    });

  } catch (error) {

  res.status(500).json({
    message: "Error al registrar incidencia",
    error,
  });
}

};
export const obtenerIncidencias = async (
  req: Request,
  res: Response
) => {
  try {

    const incidencias = await Incidence.findAll({

      include: [

        {
          model: Equipment,

          as: "equipo",

          include: [
            {
              model: Laboratory,
              as: "laboratorio",
            },
          ],
        },

        {
          model: User,
          as: "auxiliar",
        },

      ],

    });

    res.json({
      data: incidencias,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error al obtener incidencias",
    });

  }
};