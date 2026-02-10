import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import GroupEnrollment from './GroupEnrollment';
import DisciplinePlan from './DisciplinePlan';

@Table({ tableName: 'academic_year' })
export default class AcademicYear extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date_start: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date_end: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare is_current: boolean;

  @HasMany(() => GroupEnrollment)
  declare enrollments: GroupEnrollment[];

  @HasMany(() => DisciplinePlan)
  declare disciplinePlans: DisciplinePlan[];
}
