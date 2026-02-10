import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import DisciplinePlan from './DisciplinePlan';
import Classroom from './Classroom';
import Attendance from './Attendance';

@Table({ tableName: 'attendance_session' })
export default class AttendanceSession extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => DisciplinePlan)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare discipline_plan_id: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare pair_number: number;

  @ForeignKey(() => Classroom)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare classroom_id: number;

  @BelongsTo(() => DisciplinePlan)
  declare disciplinePlan: DisciplinePlan;

  @BelongsTo(() => Classroom)
  declare classroom: Classroom;

  @HasMany(() => Attendance)
  declare attendances: Attendance[];
}
