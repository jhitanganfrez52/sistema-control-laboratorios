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
import { Role } from "./Role";
@Table({ tableName: "usuarios", timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_usuario!: number;

  @Column(DataType.STRING)
  nombre_completo!: string;

  @Column({ type: DataType.STRING, unique: true })
  codigo_acceso!: string;

  @Column(DataType.STRING)
  password!: string;
  @Column({
    type: DataType.ENUM("ACTIVO", "INACTIVO"),
    defaultValue: "ACTIVO",
  })
  estado!: string;

  @Column(DataType.DATE)
  fecha_creacion!: Date;

  @Column(DataType.STRING)
  foto!: string;
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  id_rol!: number;

  @BelongsTo(() => Role)
  rol!: Role;
}
