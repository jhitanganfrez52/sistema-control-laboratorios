import { Request, Response } from "express";
import { Equipment } from "../models/Equipment";
import { Laboratory } from "../models/Laboratory";
export const crearEquipo = async (req: Request, res: Response) => {
  try {
    const {
      codigo_equipo,
      id_laboratorio,
      tipo,
      estado,
    } = req.body;

    const equipo = await Equipment.create({
      codigo_equipo,
      id_laboratorio,
      tipo,
      estado,
    });

    res.status(201).json({
      message: "Equipo creado",
      data: equipo,
    });

  } catch (error) {
    

    res.status(500).json({
      message: "Error al crear equipo",
    });
  }
};

export const obtenerEquipos = async (
  req: Request,
  res: Response
) => {
  try {

    const equipos = await Equipment.findAll({
      include: [
        {
          model: Laboratory,
          as: "laboratorio",
        },
      ],
    });

    res.json({
      data: equipos,
    });

  } catch (error) {


    res.status(500).json({
      message: "Error",
    });

  }
};