import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Department from './Department';
import DisciplinePlan from './DisciplinePlan';

@Table({ tableName: 'lecturer' })
export default class Lecturer extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare first_name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare last_name: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare middle_name: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  declare login: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password: string;

  @Column({ type: DataType.ENUM('lecturer', 'head_of_department'), allowNull: false, defaultValue: 'lecturer' })
  declare role: 'lecturer' | 'head_of_department';

  @ForeignKey(() => Department)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare department_id: number;

  @BelongsTo(() => Department)
  declare department: Department;

  @HasMany(() => DisciplinePlan)
  declare disciplinePlans: DisciplinePlan[];
}
