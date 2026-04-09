import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "contratos", timestamps: false })
export class Contract extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_contrato!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  id_auxiliar!: number;

  @Column(DataType.DATE)
  fecha_inicio!: Date;

  @Column(DataType.DATE)
  fecha_fin!: Date;

  @BelongsTo(() => User)
  auxiliar!: User;
}