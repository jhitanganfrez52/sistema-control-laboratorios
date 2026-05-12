import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import { Equipment } from "./Equipment";
import { User } from "./User";

@Table({ tableName: "incidencias", timestamps: false })
export class Incidence extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_incidencia!: number;

  @ForeignKey(() => Equipment)
  @Column(DataType.INTEGER)
  id_equipo!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  id_auxiliar!: number;

  @Column(DataType.DATE)
  fecha!: Date;

  @Column(DataType.ENUM("MAÑANA", "TARDE", "NOCHE"))
  turno!: string;

  @Column(DataType.ENUM("HARDWARE", "SOFTWARE"))
  tipo!: string;

  @Column(DataType.TEXT)
  descripcion!: string;

  @BelongsTo(() => Equipment, {
    as: "equipo",
    foreignKey: "id_equipo",
  })
  equipo!: Equipment;

  @BelongsTo(() => User, {
    as: "auxiliar",
    foreignKey: "id_auxiliar",
  })
  auxiliar!: User;
}