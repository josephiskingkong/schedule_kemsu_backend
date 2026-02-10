import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Track from './Track';

@Table({ tableName: 'specialty' })
export default class Specialty extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @HasMany(() => Track)
  declare tracks: Track[];
}
