import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Student from './Student';
import AttendanceSession from './AttendanceSession';
import AttendanceStatus from './AttendanceStatus';

@Table({ tableName: 'attendance' })
export default class Attendance extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare student_id: number;

  @ForeignKey(() => AttendanceSession)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare attendance_session_id: number;

  @ForeignKey(() => AttendanceStatus)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare attendance_status_id: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare attendance_timestamp: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string;

  @BelongsTo(() => Student)
  declare student: Student;

  @BelongsTo(() => AttendanceSession)
  declare attendanceSession: AttendanceSession;

  @BelongsTo(() => AttendanceStatus)
  declare attendanceStatus: AttendanceStatus;
}
