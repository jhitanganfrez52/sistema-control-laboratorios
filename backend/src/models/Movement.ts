import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement,
  ForeignKey, BelongsTo
} from "sequelize-typescript";
import { Equipment } from "./Equipment";
import { User } from "./User";

@Table({ tableName: "movimientos", timestamps: false })
export class Movement extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_movimiento!: number;

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

  @Column(DataType.TEXT)
  descripcion!: string;

  @Column(DataType.DATE)
  hora_salida!: Date;

  @Column(DataType.DATE)
  hora_retorno!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  devuelto!: boolean;

  @BelongsTo(() => Equipment)
  equipo!: Equipment;

  @BelongsTo(() => User)
  auxiliar!: User;
}