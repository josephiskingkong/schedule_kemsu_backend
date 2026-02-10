import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import BaseGroup from './BaseGroup';
import GroupEnrollment from './GroupEnrollment';
import Attendance from './Attendance';

@Table({ tableName: 'student' })
export default class Student extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare first_name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare last_name: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare middle_name: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare date_birth: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare age: number;

  @ForeignKey(() => BaseGroup)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare base_group_id: number;

  @BelongsTo(() => BaseGroup)
  declare baseGroup: BaseGroup;

  @HasMany(() => GroupEnrollment)
  declare enrollments: GroupEnrollment[];

  @HasMany(() => Attendance)
  declare attendances: Attendance[];
}
