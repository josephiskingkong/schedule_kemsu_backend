import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Attendance from './Attendance';

@Table({ tableName: 'attendance_status' })
export default class AttendanceStatus extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string;

  @HasMany(() => Attendance)
  declare attendances: Attendance[];
}
