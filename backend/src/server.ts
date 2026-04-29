import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";

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
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes"; // 👈 FALTA ESTO
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", authRoutes); // 👈 ESTO ES LO QUE TE FALTA
/* ======================
   SEQUELIZE (AQUÍ MISMO)
====================== */

const sequelize = new Sequelize({
  database: process.env.DB_NAME,       // sistema_laboratorios
  username: process.env.DB_USER,       // postgres
  password: process.env.DB_PASSWORD,   // tu pass
  host: process.env.DB_HOST,           // localhost
  port: Number(process.env.DB_PORT),
  dialect: "postgres",

  models: [
    User,
    Contract,
    Attendance,
    Laboratory,
    Equipment,
    Revision,
    Incidence,
    Movement,
    Report,
    Notification
  ],

  logging: false
});

/* ======================
   SERVER
====================== */

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL");

    await sequelize.sync({ alter: true });
    console.log("📦 Tablas creadas");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

start();