import { Request, Response } from "express";
import { Laboratory } from "../models/Laboratory";

export const obtenerLaboratorios = async (
  req: Request,
  res: Response
) => {
  try {

    const labs = await Laboratory.findAll();

    res.json({
      data: labs,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error",
    });
  }
};