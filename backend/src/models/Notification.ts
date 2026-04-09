import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement
} from "sequelize-typescript";

@Table({ tableName: "notificaciones", timestamps: false })
export class Notification extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.TEXT)
  mensaje!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  leido!: boolean;

  @Column(DataType.DATE)
  fecha!: Date;
}