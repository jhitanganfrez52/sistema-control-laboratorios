import "reflect-metadata";

import express from "express";
import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
// 👇 MODELOS
import { User } from "./models/User";
import { Contract } from "./models/Contract";
import { Attendance } from "./models/Attendance";
import { Laboratory } from "./models/Laboratory";
import { Equipment } from "./models/Equipment";
import { Revision } from "./models/Revision";
import { Incidence } from "./models/Incidence";
import { Movement } from "./models/Movement";
import { Report } from "./models/Report";
import { Notification } from "./models/Notification";
import { Role } from "./models/Role";
// 👇 🔥 IMPORTAR RUTAS (ESTO TE FALTABA)
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import incidenceRoutes from "./routes/incidence.routes";
import equipmentRoutes from "./routes/equipment.routes";
import laboratoryRoutes from "./routes/laboratory.routes";
dotenv.config();

const app = express();

/* ======================
   MIDDLEWARES
====================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "laboratorios_secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
/* ======================
   🔥 RUTAS (AQUÍ VA)
====================== */
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", incidenceRoutes);
app.use("/api", equipmentRoutes);
app.use("/api", laboratoryRoutes);
app.use("/uploads", express.static("uploads"));

/* ======================
   SEQUELIZE
====================== */
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "postgres",

  models: [
  User,
  Role,
  Contract,
  Attendance,
  Laboratory,
  Equipment,
  Revision,
  Incidence,
  Movement,
  Report,
  Notification,
],

  logging: false,
});

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 3000;
const crearRoles = async () => {

  const admin = await Role.findOne({
    where: {
      nombre: "ADMINISTRADOR",
    },
  });

  if (!admin) {

    await Role.create({
      nombre: "ADMINISTRADOR",
    });

  }

  const aux = await Role.findOne({
    where: {
      nombre: "AUXILIAR",
    },
  });

  if (!aux) {

    await Role.create({
      nombre: "AUXILIAR",
    });

  }

};

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL");

    await sequelize.sync({ alter: true });
    await crearRoles();
    console.log("📦 Tablas creadas correctamente");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar:", error);
  }
}

start();