import { Response, NextFunction } from 'express';
import { Op, fn, col, literal } from 'sequelize';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import Attendance from '../models/Attendance';
import AttendanceSession from '../models/AttendanceSession';
import AttendanceStatus from '../models/AttendanceStatus';
import DisciplinePlan from '../models/DisciplinePlan';
import Discipline from '../models/Discipline';
import ActivityType from '../models/ActivityType';
import WorkGroup from '../models/WorkGroup';
import BaseGroup from '../models/BaseGroup';
import Student from '../models/Student';
import GroupEnrollment from '../models/GroupEnrollment';
import AcademicYear from '../models/AcademicYear';
import sequelize from '../db';

export const getStatsByDisciplinePlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const disciplinePlanId = parseInt(req.params.disciplinePlanId as string);

    const plan = await DisciplinePlan.findByPk(disciplinePlanId, {
      include: [
        { model: Discipline },
        { model: ActivityType },
        { model: WorkGroup, include: [{ model: BaseGroup }] }
      ]
    });

    if (!plan) {
      throw new AppError('План дисциплины не найден', 404);
    }

    if (req.user.role !== 'head_of_department' && plan.lecturer_id !== req.user.id) {
      throw new AppError('Нет доступа', 403);
    }

    const sessions = await AttendanceSession.findAll({
      where: { discipline_plan_id: disciplinePlanId },
      order: [['date', 'ASC']]
    });

    const sessionIds = sessions.map(s => s.id);

    const currentYear = await AcademicYear.findOne({ where: { is_current: true } });

    const enrollments = await GroupEnrollment.findAll({
      where: {
        work_group_id: plan.work_group_id,
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
      where: {
        attendance_session_id: { [Op.in]: sessionIds }
      },
      include: [{ model: AttendanceStatus }]
    });

    const attendanceMap = new Map<string, Attendance>();
    for (const a of attendances) {
      attendanceMap.set(`${a.student_id}_${a.attendance_session_id}`, a);
    }

    const statuses = await AttendanceStatus.findAll();

    const studentStats = enrollments.map(e => {
      const student = e.student;
      const statusCounts: Record<string, number> = {};
      for (const status of statuses) {
        statusCounts[status.name] = 0;
      }
      let totalMarked = 0;

      for (const session of sessions) {
        const att = attendanceMap.get(`${student.id}_${session.id}`);
        if (att) {
          totalMarked++;
          const statusName = att.attendanceStatus?.name;
          if (statusName && statusCounts[statusName] !== undefined) {
            statusCounts[statusName]++;
          }
        }
      }

      return {
        student: {
          id: student.id,
          last_name: student.last_name,
          first_name: student.first_name,
          middle_name: student.middle_name
        },
        total_sessions: sessions.length,
        total_marked: totalMarked,
        status_counts: statusCounts
      };
    });

    res.json({
      success: true,
      data: {
        discipline_plan: {
          id: plan.id,
          discipline: plan.discipline,
          activity_type: plan.activityType,
          work_group: plan.workGroup
        },
        total_sessions: sessions.length,
        students: studentStats
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const studentId = parseInt(req.params.studentId as string);
    const { discipline_plan_id } = req.query;

    const student = await Student.findByPk(studentId);
    if (!student) {
      throw new AppError('Студент не найден', 404);
    }

    let sessionWhere: any = {};

    if (discipline_plan_id) {
      sessionWhere.discipline_plan_id = parseInt(discipline_plan_id as string);
    }

    const attendances = await Attendance.findAll({
      where: { student_id: studentId },
      include: [
        { model: AttendanceStatus },
        {
          model: AttendanceSession,
          where: sessionWhere,
          include: [{
            model: DisciplinePlan,
            include: [
              { model: Discipline },
              { model: ActivityType }
            ]
          }]
        }
      ],
      order: [['attendanceSession', 'date', 'ASC']]
    });

    const statuses = await AttendanceStatus.findAll();
    const statusCounts: Record<string, number> = {};
    for (const status of statuses) {
      statusCounts[status.name] = 0;
    }

    for (const a of attendances) {
      const statusName = a.attendanceStatus?.name;
      if (statusName && statusCounts[statusName] !== undefined) {
        statusCounts[statusName]++;
      }
    }

    res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          last_name: student.last_name,
          first_name: student.first_name,
          middle_name: student.middle_name
        },
        total_records: attendances.length,
        status_counts: statusCounts,
        details: attendances
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const currentYear = await AcademicYear.findOne({ where: { is_current: true } });

    let planWhere: any = {};
    if (req.user.role !== 'head_of_department') {
      planWhere.lecturer_id = req.user.id;
    }
    if (currentYear) {
      planWhere.academic_year_id = currentYear.id;
    }

    const plans = await DisciplinePlan.findAll({
      where: planWhere,
      include: [
        { model: Discipline },
        { model: ActivityType },
        { model: WorkGroup, include: [{ model: BaseGroup }] },
        { model: AttendanceSession }
      ]
    });

    const summary = plans.map(plan => {
      const totalSessions = plan.sessions?.length || 0;
      return {
        discipline_plan_id: plan.id,
        discipline: plan.discipline?.name,
        activity_type: plan.activityType?.short_name,
        work_group: plan.workGroup?.name,
        base_group: plan.workGroup?.baseGroup?.name,
        total_sessions: totalSessions,
        academic_hours: plan.academic_hours
      };
    });

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};
