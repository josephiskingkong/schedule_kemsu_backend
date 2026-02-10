import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import BaseGroup from './BaseGroup';
import GroupEnrollment from './GroupEnrollment';
import DisciplinePlan from './DisciplinePlan';

@Table({ tableName: 'work_group' })
export default class WorkGroup extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => BaseGroup)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare base_group_id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string;

  @BelongsTo(() => BaseGroup)
  declare baseGroup: BaseGroup;

  @HasMany(() => GroupEnrollment)
  declare enrollments: GroupEnrollment[];

  @HasMany(() => DisciplinePlan)
  declare disciplinePlans: DisciplinePlan[];
}
