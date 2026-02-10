import { Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import DisciplinePlan from '../models/DisciplinePlan';
import Discipline from '../models/Discipline';
import ActivityType from '../models/ActivityType';
import WorkGroup from '../models/WorkGroup';
import BaseGroup from '../models/BaseGroup';
import AttendanceSession from '../models/AttendanceSession';
import Classroom from '../models/Classroom';
import AcademicYear from '../models/AcademicYear';
import Lecturer from '../models/Lecturer';

export const getSchedule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const { date_from, date_to } = req.query;

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
        { model: Lecturer, attributes: ['id', 'first_name', 'last_name', 'middle_name'] },
        {
          model: WorkGroup,
          include: [{ model: BaseGroup }]
        },
        {
          model: AttendanceSession,
          include: [{ model: Classroom }],
          ...(date_from || date_to ? {
            where: {
              ...(date_from ? { date: { [Op.gte]: date_from } } : {}),
              ...(date_to ? { date: { [Op.lte]: date_to } } : {})
            }
          } : {})
        }
      ]
    });

    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

export const getDisciplines = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
        { model: Lecturer, attributes: ['id', 'first_name', 'last_name', 'middle_name'] },
        {
          model: WorkGroup,
          include: [{ model: BaseGroup }]
        }
      ]
    });

    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

export const getDisciplinePlanSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const disciplinePlanId = parseInt(req.params.disciplinePlanId as string);

    const plan = await DisciplinePlan.findByPk(disciplinePlanId);

    if (!plan) {
      throw new AppError('План дисциплины не найден', 404);
    }

    if (req.user.role !== 'head_of_department' && plan.lecturer_id !== req.user.id) {
      throw new AppError('Нет доступа к этому плану', 403);
    }

    const sessions = await AttendanceSession.findAll({
      where: { discipline_plan_id: disciplinePlanId },
      include: [{ model: Classroom }],
      order: [['date', 'ASC'], ['pair_number', 'ASC']]
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
};
