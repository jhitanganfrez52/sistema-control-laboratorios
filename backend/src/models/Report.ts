import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement,
  ForeignKey, BelongsTo
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "reportes", timestamps: false })
export class Report extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_reporte!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  id_auxiliar!: number;

  @Column(DataType.DATE)
  fecha!: Date;

  @Column(DataType.ENUM("MAÑANA","TARDE","NOCHE"))
  turno!: string;

  @Column(DataType.TEXT)
  resumen!: string;

  @BelongsTo(() => User)
  auxiliar!: User;
}