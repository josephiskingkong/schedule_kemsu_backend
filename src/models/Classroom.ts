import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import AttendanceSession from './AttendanceSession';

@Table({ tableName: 'classroom' })
export default class Classroom extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare name: string;

  @HasMany(() => AttendanceSession)
  declare sessions: AttendanceSession[];
}
