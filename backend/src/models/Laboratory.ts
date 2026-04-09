import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement
} from "sequelize-typescript";

@Table({ tableName: "laboratorios", timestamps: false })
export class Laboratory extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_laboratorio!: number;

  @Column(DataType.STRING)
  nombre!: string;
}