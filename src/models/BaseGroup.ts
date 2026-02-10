import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Track from './Track';
import WorkGroup from './WorkGroup';
import Student from './Student';

@Table({ tableName: 'base_group' })
export default class BaseGroup extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare intake_year: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare course_number: number;

  @ForeignKey(() => Track)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare track_id: number;

  @BelongsTo(() => Track)
  declare track: Track;

  @HasMany(() => WorkGroup)
  declare workGroups: WorkGroup[];

  @HasMany(() => Student)
  declare students: Student[];
}
