import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Student from './Student';
import Lesson from './Lesson';

@Table({ tableName: 'attendance', timestamps: true, underscored: true })
export default class Attendance extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Lesson)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare lesson_id: number;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare student_id: number;

  @Column({ type: DataType.ENUM('present', 'absent', 'late', 'excused'), allowNull: false, defaultValue: 'present' })
  declare status: 'present' | 'absent' | 'late' | 'excused';

  @BelongsTo(() => Lesson)
  declare lesson: Lesson;

  @BelongsTo(() => Student)
  declare student: Student;
}
