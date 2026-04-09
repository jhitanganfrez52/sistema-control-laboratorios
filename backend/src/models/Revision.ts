import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement,
  ForeignKey, BelongsTo
} from "sequelize-typescript";
import { Equipment } from "./Equipment";
import { User } from "./User";

@Table({ tableName: "revisiones", timestamps: false })
export class Revision extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_revision!: number;

  @ForeignKey(() => Equipment)
  @Column(DataType.INTEGER)
  id_equipo!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  id_auxiliar!: number;

  @Column(DataType.DATE)
  fecha!: Date;

  @Column(DataType.ENUM("MAÑANA","TARDE","NOCHE"))
  turno!: string;

  @Column(DataType.ENUM("FUNCIONA","NO_FUNCIONA"))
  estado_operativo!: string;

  @Column(DataType.TEXT)
  observacion!: string;

  @BelongsTo(() => Equipment)
  equipo!: Equipment;

  @BelongsTo(() => User)
  auxiliar!: User;
}