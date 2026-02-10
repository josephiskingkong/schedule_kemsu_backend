import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Specialty from './Specialty';
import BaseGroup from './BaseGroup';

@Table({ tableName: 'track' })
export default class Track extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @ForeignKey(() => Specialty)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare specialty_id: number;

  @BelongsTo(() => Specialty)
  declare specialty: Specialty;

  @HasMany(() => BaseGroup)
  declare baseGroups: BaseGroup[];
}
