import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Group from './Group';
import Lecturer from './Lecturer';
import Attendance from './Attendance';

@Table({ tableName: 'lesson', timestamps: true, underscored: true })
export default class Lesson extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare group_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare subject_name: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare date_time: Date;

  @Column({ type: DataType.INTEGER })
  declare subgroup: number;

  @Column({ type: DataType.INTEGER })
  declare academic_hours: number;

  @ForeignKey(() => Lecturer)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare lecturer_id: number;

  @BelongsTo(() => Group)
  declare group: Group;

  @BelongsTo(() => Lecturer)
  declare lecturer: Lecturer;

  @HasMany(() => Attendance)
  declare attendances: Attendance[];
}
