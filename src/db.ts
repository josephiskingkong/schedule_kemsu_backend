import { Sequelize } from 'sequelize-typescript';
import config from './config';
import Faculty from './models/Faculty';
import Department from './models/Department';
import Lecturer from './models/Lecturer';
import Specialty from './models/Specialty';
import Track from './models/Track';
import BaseGroup from './models/BaseGroup';
import WorkGroup from './models/WorkGroup';
import Student from './models/Student';
import AcademicYear from './models/AcademicYear';
import GroupEnrollment from './models/GroupEnrollment';
import Discipline from './models/Discipline';
import ActivityType from './models/ActivityType';
import DisciplinePlan from './models/DisciplinePlan';
import Classroom from './models/Classroom';
import AttendanceSession from './models/AttendanceSession';
import AttendanceStatus from './models/AttendanceStatus';
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
    Faculty,
    Department,
    Lecturer,
    Specialty,
    Track,
    BaseGroup,
    WorkGroup,
    Student,
    AcademicYear,
    GroupEnrollment,
    Discipline,
    ActivityType,
    DisciplinePlan,
    Classroom,
    AttendanceSession,
    AttendanceStatus,
    Attendance
  ],
  define: {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
});

export default sequelize;
