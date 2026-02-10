import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Faculty from './Faculty';
import Lecturer from './Lecturer';

@Table({ tableName: 'department' })
export default class Department extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare short_name: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare full_name: string;

  @ForeignKey(() => Faculty)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare faculty_id: number;

  @BelongsTo(() => Faculty)
  declare faculty: Faculty;

  @HasMany(() => Lecturer)
  declare lecturers: Lecturer[];
}
