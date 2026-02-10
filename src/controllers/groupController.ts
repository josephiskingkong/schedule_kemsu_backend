import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import BaseGroup from '../models/BaseGroup';
import WorkGroup from '../models/WorkGroup';
import Track from '../models/Track';
import Specialty from '../models/Specialty';
import DisciplinePlan from '../models/DisciplinePlan';
import Discipline from '../models/Discipline';
import ActivityType from '../models/ActivityType';
import AcademicYear from '../models/AcademicYear';

export const getGroups = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const currentYear = await AcademicYear.findOne({ where: { is_current: true } });

    let workGroupIds: number[];

    if (req.user.role === 'head_of_department') {
      const plans = await DisciplinePlan.findAll({
        where: currentYear ? { academic_year_id: currentYear.id } : {},
        attributes: ['work_group_id']
      });
      workGroupIds = [...new Set(plans.map(p => p.work_group_id))];
    } else {
      const plans = await DisciplinePlan.findAll({
        where: {
          lecturer_id: req.user.id,
          ...(currentYear ? { academic_year_id: currentYear.id } : {})
        },
        attributes: ['work_group_id']
      });
      workGroupIds = [...new Set(plans.map(p => p.work_group_id))];
    }

    const workGroups = await WorkGroup.findAll({
      where: { id: workGroupIds },
      include: [{
        model: BaseGroup,
        include: [{
          model: Track,
          include: [{ model: Specialty }]
        }]
      }]
    });

    const baseGroupMap = new Map<number, any>();

    for (const wg of workGroups) {
      const bg = wg.baseGroup;
      if (!baseGroupMap.has(bg.id)) {
        baseGroupMap.set(bg.id, {
          id: bg.id,
          name: bg.name,
          intake_year: bg.intake_year,
          course_number: bg.course_number,
          track: bg.track,
          workGroups: []
        });
      }
      baseGroupMap.get(bg.id).workGroups.push({
        id: wg.id,
        name: wg.name,
        comment: wg.comment
      });
    }

    res.json({
      success: true,
      data: Array.from(baseGroupMap.values())
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkGroupsByBaseGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const baseGroupId = parseInt(req.params.baseGroupId as string);

    const currentYear = await AcademicYear.findOne({ where: { is_current: true } });

    let whereClause: any = {};

    if (req.user.role !== 'head_of_department') {
      whereClause.lecturer_id = req.user.id;
    }

    if (currentYear) {
      whereClause.academic_year_id = currentYear.id;
    }

    const workGroups = await WorkGroup.findAll({
      where: { base_group_id: baseGroupId },
      include: [{
        model: DisciplinePlan,
        where: whereClause,
        required: true,
        include: [
          { model: Discipline },
          { model: ActivityType }
        ]
      }]
    });

    res.json({ success: true, data: workGroups });
  } catch (error) {
    next(error);
  }
};
