import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import Group from '../models/Group';
import Student from '../models/Student';

export const getGroups = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const groups = await Group.findAll({
      include: [{ model: Student, attributes: ['id', 'first_name', 'last_name', 'middle_name', 'photo', 'subgroup'] }],
      order: [['name', 'ASC']]
    });

    res.json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const group = await Group.findByPk(req.params.id as string, {
      include: [{ model: Student, attributes: ['id', 'first_name', 'last_name', 'middle_name', 'photo', 'subgroup'] }]
    });

    if (!group) throw new AppError('Группа не найдена', 404);

    res.json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, students } = req.body;

    if (!name) throw new AppError('Название группы обязательно', 400);

    const existing = await Group.findOne({ where: { name } });
    if (existing) throw new AppError('Группа с таким названием уже существует', 409);

    const group = await Group.create({ name });

    if (students && Array.isArray(students) && students.length > 0) {
      const studentRecords = students.map((s: any) => ({
        first_name: s.first_name,
        last_name: s.last_name,
        middle_name: s.middle_name || null,
        photo: s.photo || null,
        group_id: group.id,
        subgroup: s.subgroup || null
      }));
      await Student.bulkCreate(studentRecords);
    }

    const result = await Group.findByPk(group.id, {
      include: [{ model: Student }]
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const updateGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const group = await Group.findByPk(req.params.id as string);
    if (!group) throw new AppError('Группа не найдена', 404);

    const { name } = req.body;
    if (name) {
      const existing = await Group.findOne({ where: { name } });
      if (existing && existing.id !== group.id) throw new AppError('Группа с таким названием уже существует', 409);
      group.name = name;
      await group.save();
    }

    res.json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const group = await Group.findByPk(req.params.id as string);
    if (!group) throw new AppError('Группа не найдена', 404);

    await group.destroy();

    res.json({ success: true, message: 'Группа удалена' });
  } catch (error) {
    next(error);
  }
};
