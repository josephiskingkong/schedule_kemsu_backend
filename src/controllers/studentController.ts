import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import Student from '../models/Student';
import Group from '../models/Group';

export const getStudentsByGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const groupId = parseInt(req.params.groupId as string);
    const { subgroup } = req.query;

    const where: any = { group_id: groupId };
    if (subgroup) where.subgroup = parseInt(subgroup as string);

    const students = await Student.findAll({
      where,
      attributes: ['id', 'first_name', 'last_name', 'middle_name', 'photo', 'subgroup'],
      order: [['last_name', 'ASC'], ['first_name', 'ASC']]
    });

    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

export const addStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { first_name, last_name, middle_name, photo, group_id, subgroup } = req.body;

    if (!first_name || !last_name || !group_id) {
      throw new AppError('Имя, фамилия и группа обязательны', 400);
    }

    const group = await Group.findByPk(group_id);
    if (!group) throw new AppError('Группа не найдена', 404);

    if (subgroup && (subgroup < 1 || subgroup > 3)) {
      throw new AppError('Подгруппа должна быть от 1 до 3', 400);
    }

    const student = await Student.create({
      first_name,
      last_name,
      middle_name: middle_name || null,
      photo: photo || null,
      group_id,
      subgroup: subgroup || null
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const student = await Student.findByPk(req.params.id as string);
    if (!student) throw new AppError('Студент не найден', 404);

    const { first_name, last_name, middle_name, photo, subgroup, group_id } = req.body;

    if (first_name !== undefined) student.first_name = first_name;
    if (last_name !== undefined) student.last_name = last_name;
    if (middle_name !== undefined) student.middle_name = middle_name;
    if (photo !== undefined) student.photo = photo;
    if (subgroup !== undefined) {
      if (subgroup !== null && (subgroup < 1 || subgroup > 3)) {
        throw new AppError('Подгруппа должна быть от 1 до 3', 400);
      }
      student.subgroup = subgroup;
    }
    if (group_id !== undefined) {
      const group = await Group.findByPk(group_id);
      if (!group) throw new AppError('Группа не найдена', 404);
      student.group_id = group_id;
    }

    await student.save();

    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const student = await Student.findByPk(req.params.id as string);
    if (!student) throw new AppError('Студент не найден', 404);

    await student.destroy();

    res.json({ success: true, message: 'Студент удалён' });
  } catch (error) {
    next(error);
  }
};
