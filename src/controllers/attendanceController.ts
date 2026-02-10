import { Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import Attendance from '../models/Attendance';
import AttendanceSession from '../models/AttendanceSession';
import AttendanceStatus from '../models/AttendanceStatus';
import DisciplinePlan from '../models/DisciplinePlan';
import Student from '../models/Student';
import GroupEnrollment from '../models/GroupEnrollment';
import Classroom from '../models/Classroom';
import AcademicYear from '../models/AcademicYear';

export const createSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const { discipline_plan_id, date, pair_number, classroom_id } = req.body;

    const plan = await DisciplinePlan.findByPk(discipline_plan_id);

    if (!plan) {
      throw new AppError('План дисциплины не найден', 404);
    }

    if (req.user.role !== 'head_of_department' && plan.lecturer_id !== req.user.id) {
      throw new AppError('Нет доступа к этому плану', 403);
    }

    const session = await AttendanceSession.create({
      discipline_plan_id,
      date,
      pair_number: pair_number || null,
      classroom_id: classroom_id || null
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

export const getSessionAttendance = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const sessionId = parseInt(req.params.sessionId as string);

    const session = await AttendanceSession.findByPk(sessionId, {
      include: [{
        model: DisciplinePlan
      }]
    });

    if (!session) {
      throw new AppError('Сессия не найдена', 404);
    }

    if (req.user.role !== 'head_of_department' && session.disciplinePlan.lecturer_id !== req.user.id) {
      throw new AppError('Нет доступа', 403);
    }

    const currentYear = await AcademicYear.findOne({ where: { is_current: true } });

    const enrollments = await GroupEnrollment.findAll({
      where: {
        work_group_id: session.disciplinePlan.work_group_id,
        is_active: true,
        ...(currentYear ? { academic_year_id: currentYear.id } : {})
      },
      include: [{
        model: Student,
        attributes: ['id', 'first_name', 'last_name', 'middle_name']
      }],
      order: [['student', 'last_name', 'ASC']]
    });

    const attendances = await Attendance.findAll({
      where: { attendance_session_id: sessionId },
      include: [{ model: AttendanceStatus }]
    });

    const attendanceMap = new Map(attendances.map(a => [a.student_id, a]));

    const result = enrollments.map(e => ({
      student: e.student,
      attendance: attendanceMap.get(e.student_id) || null
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const markAttendance = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const sessionId = parseInt(req.params.sessionId as string);
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      throw new AppError('Необходимо передать массив records', 400);
    }

    const session = await AttendanceSession.findByPk(sessionId, {
      include: [{ model: DisciplinePlan }]
    });

    if (!session) {
      throw new AppError('Сессия не найдена', 404);
    }

    if (req.user.role !== 'head_of_department' && session.disciplinePlan.lecturer_id !== req.user.id) {
      throw new AppError('Нет доступа', 403);
    }

    const results = [];

    for (const record of records) {
      const { student_id, attendance_status_id, comment } = record;

      const [attendance, created] = await Attendance.findOrCreate({
        where: {
          student_id,
          attendance_session_id: sessionId
        },
        defaults: {
          student_id,
          attendance_session_id: sessionId,
          attendance_status_id,
          attendance_timestamp: new Date(),
          comment: comment || null
        }
      });

      if (!created) {
        await attendance.update({
          attendance_status_id,
          attendance_timestamp: new Date(),
          comment: comment || null
        });
      }

      results.push(attendance);
    }

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const getStatuses = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const statuses = await AttendanceStatus.findAll();
    res.json({ success: true, data: statuses });
  } catch (error) {
    next(error);
  }
};

export const getClassrooms = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classrooms = await Classroom.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: classrooms });
  } catch (error) {
    next(error);
  }
};
