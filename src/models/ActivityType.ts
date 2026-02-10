import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import DisciplinePlan from './DisciplinePlan';

@Table({ tableName: 'activity_type' })
export default class ActivityType extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare short_name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare full_name: string;

  @HasMany(() => DisciplinePlan)
  declare disciplinePlans: DisciplinePlan[];
}
