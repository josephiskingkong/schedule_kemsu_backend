'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('faculty', [
      { id: 1, short_name: 'МиКН', full_name: 'Факультет математики и компьютерных наук' }
    ]);

    await queryInterface.bulkInsert('department', [
      { id: 1, short_name: 'ИВТ', full_name: 'Кафедра информатики и вычислительной техники', faculty_id: 1 },
      { id: 2, short_name: 'МАТ', full_name: 'Кафедра математического анализа', faculty_id: 1 }
    ]);

    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('lecturer', [
      {
        id: 1,
        first_name: 'Иван',
        last_name: 'Петров',
        middle_name: 'Сергеевич',
        login: 'petrov@kemsu.ru',
        password: hashedPassword,
        role: 'lecturer',
        department_id: 1
      },
      {
        id: 2,
        first_name: 'Алексей',
        last_name: 'Гайдай',
        middle_name: 'Викторович',
        login: 'gaidai@kemsu.ru',
        password: hashedPassword,
        role: 'head_of_department',
        department_id: 1
      },
      {
        id: 3,
        first_name: 'Мария',
        last_name: 'Сидорова',
        middle_name: 'Александровна',
        login: 'sidorova@kemsu.ru',
        password: hashedPassword,
        role: 'lecturer',
        department_id: 1
      }
    ]);

    await queryInterface.bulkInsert('specialty', [
      { id: 1, name: 'Прикладная математика и информатика' },
      { id: 2, name: 'Информатика и вычислительная техника' }
    ]);

    await queryInterface.bulkInsert('track', [
      { id: 1, name: 'Системное программирование', specialty_id: 1 },
      { id: 2, name: 'Веб-разработка', specialty_id: 2 }
    ]);

    await queryInterface.bulkInsert('base_group', [
      { id: 1, name: 'ПМИ-21', intake_year: 2021, course_number: 4, track_id: 1 },
      { id: 2, name: 'ИВТ-22', intake_year: 2022, course_number: 3, track_id: 2 }
    ]);

    await queryInterface.bulkInsert('work_group', [
      { id: 1, base_group_id: 1, name: 'ПМИ-21 (подгруппа 1)', comment: 'Первая подгруппа' },
      { id: 2, base_group_id: 1, name: 'ПМИ-21 (подгруппа 2)', comment: 'Вторая подгруппа' },
      { id: 3, base_group_id: 2, name: 'ИВТ-22 (вся группа)', comment: null }
    ]);

    await queryInterface.bulkInsert('student', [
      { id: 1, first_name: 'Анна', last_name: 'Иванова', middle_name: 'Петровна', date_birth: '2003-05-15', age: 22, base_group_id: 1 },
      { id: 2, first_name: 'Дмитрий', last_name: 'Козлов', middle_name: 'Андреевич', date_birth: '2003-08-20', age: 22, base_group_id: 1 },
      { id: 3, first_name: 'Елена', last_name: 'Морозова', middle_name: 'Игоревна', date_birth: '2003-02-10', age: 23, base_group_id: 1 },
      { id: 4, first_name: 'Сергей', last_name: 'Новиков', middle_name: 'Дмитриевич', date_birth: '2003-11-30', age: 22, base_group_id: 1 },
      { id: 5, first_name: 'Ольга', last_name: 'Петрова', middle_name: 'Владимировна', date_birth: '2004-01-22', age: 22, base_group_id: 2 },
      { id: 6, first_name: 'Максим', last_name: 'Соколов', middle_name: 'Алексеевич', date_birth: '2004-07-08', age: 21, base_group_id: 2 },
      { id: 7, first_name: 'Виктория', last_name: 'Лебедева', middle_name: 'Николаевна', date_birth: '2004-03-14', age: 21, base_group_id: 2 },
      { id: 8, first_name: 'Артём', last_name: 'Волков', middle_name: 'Сергеевич', date_birth: '2004-09-25', age: 21, base_group_id: 2 }
    ]);

    await queryInterface.bulkInsert('academic_year', [
      { id: 1, name: '2025-2026', date_start: '2025-09-01', date_end: '2026-06-30', is_current: true }
    ]);

    await queryInterface.bulkInsert('group_enrollment', [
      { student_id: 1, work_group_id: 1, academic_year_id: 1, enrollment_date: '2025-09-01', is_active: true },
      { student_id: 2, work_group_id: 1, academic_year_id: 1, enrollment_date: '2025-09-01', is_active: true },
      { student_id: 3, work_group_id: 2, academic_year_id: 1, enrollment_date: '2025-09-01', is_active: true },
      { student_id: 4, work_group_id: 2, academic_year_id: 1, enrollment_date: '2025-09-01', is_active: true },
      { student_id: 5, work_group_id: 3, academic_year_id: 1, enrollment_date: '2025-09-01', is_active: true },
      { student_id: 6, work_group_id: 3, academic_year_id: 1, enrollment_date: '2025-09-01', is_active: true },
      { student_id: 7, work_group_id: 3, academic_year_id: 1, enrollment_date: '2025-09-01', is_active: true },
      { student_id: 8, work_group_id: 3, academic_year_id: 1, enrollment_date: '2025-09-01', is_active: true }
    ]);

    await queryInterface.bulkInsert('discipline', [
      { id: 1, name: 'Базы данных' },
      { id: 2, name: 'Веб-программирование' },
      { id: 3, name: 'Операционные системы' }
    ]);

    await queryInterface.bulkInsert('activity_type', [
      { id: 1, short_name: 'Лек', full_name: 'Лекция' },
      { id: 2, short_name: 'Лаб', full_name: 'Лабораторная работа' },
      { id: 3, short_name: 'Прак', full_name: 'Практическое занятие' }
    ]);

    await queryInterface.bulkInsert('discipline_plan', [
      { id: 1, lecturer_id: 1, work_group_id: 1, discipline_id: 1, activity_type_id: 2, academic_year_id: 1, academic_hours: 36 },
      { id: 2, lecturer_id: 1, work_group_id: 2, discipline_id: 1, activity_type_id: 2, academic_year_id: 1, academic_hours: 36 },
      { id: 3, lecturer_id: 3, work_group_id: 3, discipline_id: 2, activity_type_id: 2, academic_year_id: 1, academic_hours: 48 },
      { id: 4, lecturer_id: 1, work_group_id: 3, discipline_id: 1, activity_type_id: 1, academic_year_id: 1, academic_hours: 18 },
      { id: 5, lecturer_id: 3, work_group_id: 1, discipline_id: 3, activity_type_id: 1, academic_year_id: 1, academic_hours: 18 },
      { id: 6, lecturer_id: 3, work_group_id: 2, discipline_id: 3, activity_type_id: 1, academic_year_id: 1, academic_hours: 18 }
    ]);

    await queryInterface.bulkInsert('classroom', [
      { id: 1, name: '301а' },
      { id: 2, name: '405' },
      { id: 3, name: '210' }
    ]);

    await queryInterface.bulkInsert('attendance_status', [
      { id: 1, name: 'Присутствует', comment: null },
      { id: 2, name: 'Отсутствует', comment: 'Без уважительной причины' },
      { id: 3, name: 'Уважительная', comment: 'Отсутствует по уважительной причине' },
      { id: 4, name: 'Опоздание', comment: null }
    ]);

    await queryInterface.bulkInsert('attendance_session', [
      { id: 1, discipline_plan_id: 1, date: '2026-02-02', pair_number: 1, classroom_id: 1 },
      { id: 2, discipline_plan_id: 2, date: '2026-02-02', pair_number: 2, classroom_id: 1 },
      { id: 3, discipline_plan_id: 3, date: '2026-02-03', pair_number: 1, classroom_id: 2 }
    ]);

    await queryInterface.bulkInsert('attendance', [
      { student_id: 1, attendance_session_id: 1, attendance_status_id: 1, attendance_timestamp: new Date(), comment: null },
      { student_id: 2, attendance_session_id: 1, attendance_status_id: 1, attendance_timestamp: new Date(), comment: null },
      { student_id: 3, attendance_session_id: 2, attendance_status_id: 2, attendance_timestamp: new Date(), comment: 'Не пришла' },
      { student_id: 4, attendance_session_id: 2, attendance_status_id: 1, attendance_timestamp: new Date(), comment: null },
      { student_id: 5, attendance_session_id: 3, attendance_status_id: 1, attendance_timestamp: new Date(), comment: null },
      { student_id: 6, attendance_session_id: 3, attendance_status_id: 4, attendance_timestamp: new Date(), comment: 'Опоздал на 10 минут' },
      { student_id: 7, attendance_session_id: 3, attendance_status_id: 1, attendance_timestamp: new Date(), comment: null },
      { student_id: 8, attendance_session_id: 3, attendance_status_id: 3, attendance_timestamp: new Date(), comment: 'Больничный' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('attendance', null, {});
    await queryInterface.bulkDelete('attendance_session', null, {});
    await queryInterface.bulkDelete('attendance_status', null, {});
    await queryInterface.bulkDelete('classroom', null, {});
    await queryInterface.bulkDelete('discipline_plan', null, {});
    await queryInterface.bulkDelete('activity_type', null, {});
    await queryInterface.bulkDelete('discipline', null, {});
    await queryInterface.bulkDelete('group_enrollment', null, {});
    await queryInterface.bulkDelete('academic_year', null, {});
    await queryInterface.bulkDelete('student', null, {});
    await queryInterface.bulkDelete('work_group', null, {});
    await queryInterface.bulkDelete('base_group', null, {});
    await queryInterface.bulkDelete('track', null, {});
    await queryInterface.bulkDelete('specialty', null, {});
    await queryInterface.bulkDelete('lecturer', null, {});
    await queryInterface.bulkDelete('department', null, {});
    await queryInterface.bulkDelete('faculty', null, {});
  }
};
