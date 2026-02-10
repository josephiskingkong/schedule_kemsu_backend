import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import Student from '../models/Student';
import GroupEnrollment from '../models/GroupEnrollment';
import WorkGroup from '../models/WorkGroup';
import BaseGroup from '../models/BaseGroup';
import AcademicYear from '../models/AcademicYear';

export const getStudentsByWorkGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const workGroupId = parseInt(req.params.workGroupId as string);

    const currentYear = await AcademicYear.findOne({ where: { is_current: true } });

    const enrollments = await GroupEnrollment.findAll({
      where: {
        work_group_id: workGroupId,
        is_active: true,
        ...(currentYear ? { academic_year_id: currentYear.id } : {})
      },
      include: [{
        model: Student,
        attributes: ['id', 'first_name', 'last_name', 'middle_name', 'date_birth', 'age']
      }],
      order: [['student', 'last_name', 'ASC'], ['student', 'first_name', 'ASC']]
    });

    const students = enrollments.map(e => e.student);

    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

export const getStudentsByBaseGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const baseGroupId = parseInt(req.params.baseGroupId as string);

    const students = await Student.findAll({
      where: { base_group_id: baseGroupId },
      attributes: ['id', 'first_name', 'last_name', 'middle_name', 'date_birth', 'age'],
      order: [['last_name', 'ASC'], ['first_name', 'ASC']]
    });

    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};
