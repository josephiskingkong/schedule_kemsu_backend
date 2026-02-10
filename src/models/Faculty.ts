import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Department from './Department';

@Table({ tableName: 'faculty' })
export default class Faculty extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare short_name: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare full_name: string;

  @HasMany(() => Department)
  declare departments: Department[];
}
