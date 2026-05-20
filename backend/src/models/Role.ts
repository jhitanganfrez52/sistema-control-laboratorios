import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";

import { User } from "./User";

@Table({
  tableName: "roles",
  timestamps: false,
})
export class Role extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_rol!: number;

  @Column(DataType.STRING)
  nombre!: string;

  @HasMany(() => User)
  usuarios!: User[];
}