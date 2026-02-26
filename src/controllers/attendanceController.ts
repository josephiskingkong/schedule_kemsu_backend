import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import Attendance from '../models/Attendance';

export const updateAttendance = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const attendance = await Attendance.findByPk(req.params.id as string);
    if (!attendance) throw new AppError('Запись посещаемости не найдена', 404);

    const { status } = req.body;
    const validStatuses = ['present', 'absent', 'late', 'excused'];

    if (!status || !validStatuses.includes(status)) {
      throw new AppError('Статус должен быть: present, absent, late или excused', 400);
    }

    attendance.status = status;
    await attendance.save();

    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

export const getStatuses = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json({
      success: true,
      data: [
        { value: 'present', label: 'Присутствует' },
        { value: 'absent', label: 'Отсутствует' },
        { value: 'late', label: 'Опоздал' },
        { value: 'excused', label: 'Уважительная' }
      ]
    });
  } catch (error) {
    next(error);
  }
};
