import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

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

  @Column(DataType.ENUM("ADMINISTRADOR", "AUXILIAR"))
  rol!: string;

  @Column({
    type: DataType.ENUM("ACTIVO", "INACTIVO"),
    defaultValue: "ACTIVO",
  })
  estado!: string;

  @Column(DataType.DATE)
  fecha_creacion!: Date;
}
