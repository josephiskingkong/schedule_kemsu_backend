import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Student from './Student';
import WorkGroup from './WorkGroup';
import AcademicYear from './AcademicYear';

@Table({ tableName: 'group_enrollment' })
export default class GroupEnrollment extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare student_id: number;

  @ForeignKey(() => WorkGroup)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare work_group_id: number;

  @ForeignKey(() => AcademicYear)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare academic_year_id: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare enrollment_date: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare is_active: boolean;

  @BelongsTo(() => Student)
  declare student: Student;

  @BelongsTo(() => WorkGroup)
  declare workGroup: WorkGroup;

  @BelongsTo(() => AcademicYear)
  declare academicYear: AcademicYear;
}
