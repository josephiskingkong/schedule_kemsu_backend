import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Student from './Student';
import Lesson from './Lesson';

@Table({ tableName: 'student_group', timestamps: true, underscored: true })
export default class Group extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare name: string;

  @HasMany(() => Student)
  declare students: Student[];

  @HasMany(() => Lesson)
  declare lessons: Lesson[];
}
