import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import Lesson from '../models/Lesson';
import Group from '../models/Group';
import Student from '../models/Student';
import Attendance from '../models/Attendance';

export const getLessons = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const lessons = await Lesson.findAll({
      where: { lecturer_id: req.user.id },
      include: [{ model: Group, attributes: ['id', 'name'] }],
      order: [['date_time', 'DESC']]
    });

    res.json({ success: true, data: lessons });
  } catch (error) {
    next(error);
  }
};

export const getLessonById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lesson = await Lesson.findByPk(req.params.id as string, {
      include: [
        { model: Group, attributes: ['id', 'name'] },
        {
          model: Attendance,
          include: [{ model: Student, attributes: ['id', 'first_name', 'last_name', 'middle_name', 'photo', 'subgroup'] }]
        }
      ]
    });

    if (!lesson) throw new AppError('Занятие не найдено', 404);

    res.json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Не авторизован', 401);

    const { group_id, subject_name, date_time, subgroup, academic_hours } = req.body;

    if (!group_id || !subject_name || !date_time) {
      throw new AppError('Группа, название предмета и дата/время обязательны', 400);
    }

    const group = await Group.findByPk(group_id);
    if (!group) throw new AppError('Группа не найдена', 404);

    if (subgroup && (subgroup < 1 || subgroup > 3)) {
      throw new AppError('Подгруппа должна быть от 1 до 3', 400);
    }

    const lesson = await Lesson.create({
      group_id,
      subject_name,
      date_time,
      subgroup: subgroup || null,
      academic_hours: academic_hours || null,
      lecturer_id: req.user.id
    });

    const where: any = { group_id };
    if (subgroup) {
      where.subgroup = subgroup;
    }

    const students = await Student.findAll({ where });

    if (students.length > 0) {
      const attendanceRecords = students.map(s => ({
        lesson_id: lesson.id,
        student_id: s.id,
        status: 'present' as const
      }));
      await Attendance.bulkCreate(attendanceRecords);
    }

    const result = await Lesson.findByPk(lesson.id, {
      include: [
        { model: Group, attributes: ['id', 'name'] },
        {
          model: Attendance,
          include: [{ model: Student, attributes: ['id', 'first_name', 'last_name', 'middle_name', 'photo', 'subgroup'] }]
        }
      ]
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lesson = await Lesson.findByPk(req.params.id as string);
    if (!lesson) throw new AppError('Занятие не найдено', 404);

    await lesson.destroy();

    res.json({ success: true, message: 'Занятие удалено' });
  } catch (error) {
    next(error);
  }
};
