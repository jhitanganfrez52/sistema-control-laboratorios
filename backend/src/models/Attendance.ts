import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "asistencias", timestamps: false })
export class Attendance extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_asistencia!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  id_auxiliar!: number;

  @Column(DataType.DATE)
  fecha!: Date;

  @Column(DataType.ENUM("MAÑANA", "TARDE", "NOCHE"))
  turno!: string;

  @Column(DataType.TIME)
  hora_ingreso!: string;

  @Column({
    type: DataType.ENUM("PRESENTE", "AUSENTE", "PERMISO"),
    defaultValue: "PRESENTE"
  })
  estado!: string;

  @BelongsTo(() => User)
  auxiliar!: User;
}