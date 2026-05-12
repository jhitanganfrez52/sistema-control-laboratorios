import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement,
  ForeignKey, BelongsTo
} from "sequelize-typescript";
import { Laboratory } from "./Laboratory";

@Table({ tableName: "equipos", timestamps: false })
export class Equipment extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_equipo!: number;

  @Column({ type: DataType.STRING, unique: true })
  codigo_equipo!: string;

  @ForeignKey(() => Laboratory)
  @Column(DataType.INTEGER)
  id_laboratorio!: number;

  @Column(DataType.ENUM("CPU","MONITOR","TECLADO","MOUSE","ESTABILIZADOR","OTRO"))
  tipo!: string;

  @Column({
    type: DataType.ENUM("OPERATIVO","MANTENIMIENTO","DAÑADO"),
    defaultValue: "OPERATIVO"
  })
  estado!: string;

  @BelongsTo(() => Laboratory, {
  as: "laboratorio",
  foreignKey: "id_laboratorio",
})
laboratorio!: Laboratory;
}