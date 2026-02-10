import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import DisciplinePlan from './DisciplinePlan';

@Table({ tableName: 'discipline' })
export default class Discipline extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @HasMany(() => DisciplinePlan)
  declare disciplinePlans: DisciplinePlan[];
}
