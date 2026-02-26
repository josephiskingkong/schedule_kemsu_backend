import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Lesson from './Lesson';

@Table({ tableName: 'lecturer', timestamps: false })
export default class Lecturer extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare first_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare last_name: string;

  @Column({ type: DataType.STRING })
  declare middle_name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare login: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @HasMany(() => Lesson)
  declare lessons: Lesson[];
}
