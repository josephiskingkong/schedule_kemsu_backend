import { Sequelize } from 'sequelize-typescript';
import config from './config';
import Lecturer from './models/Lecturer';
import Group from './models/Group';
import Student from './models/Student';
import Lesson from './models/Lesson';
import Attendance from './models/Attendance';

const sequelize = new Sequelize({
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  models: [
    Lecturer,
    Group,
    Student,
    Lesson,
    Attendance
  ],
  define: {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
});

export default sequelize;
