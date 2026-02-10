import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Lecturer from './Lecturer';
import WorkGroup from './WorkGroup';
import Discipline from './Discipline';
import ActivityType from './ActivityType';
import AcademicYear from './AcademicYear';
import AttendanceSession from './AttendanceSession';

@Table({ tableName: 'discipline_plan' })
export default class DisciplinePlan extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Lecturer)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare lecturer_id: number;

  @ForeignKey(() => WorkGroup)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare work_group_id: number;

  @ForeignKey(() => Discipline)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare discipline_id: number;

  @ForeignKey(() => ActivityType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare activity_type_id: number;

  @ForeignKey(() => AcademicYear)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare academic_year_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare academic_hours: number;

  @BelongsTo(() => Lecturer)
  declare lecturer: Lecturer;

  @BelongsTo(() => WorkGroup)
  declare workGroup: WorkGroup;

  @BelongsTo(() => Discipline)
  declare discipline: Discipline;

  @BelongsTo(() => ActivityType)
  declare activityType: ActivityType;

  @BelongsTo(() => AcademicYear)
  declare academicYear: AcademicYear;

  @HasMany(() => AttendanceSession)
  declare sessions: AttendanceSession[];
}
