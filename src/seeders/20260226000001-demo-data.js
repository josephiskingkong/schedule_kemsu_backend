'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('lecturer', [
      { id: 1, first_name: 'Иван', last_name: 'Петров', middle_name: 'Сергеевич', login: 'petrov@kemsu.ru', password: hashedPassword },
      { id: 2, first_name: 'Алексей', last_name: 'Гайдай', middle_name: 'Викторович', login: 'gaidai@kemsu.ru', password: hashedPassword }
    ]);

    const now = new Date();

    await queryInterface.bulkInsert('student_group', [
      { id: 1, name: 'ПИ-221', created_at: now, updated_at: now },
      { id: 2, name: 'ПИ-222', created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('student', [
      { id: 1, first_name: 'Дмитрий', last_name: 'Смирнов', middle_name: 'Алексеевич', photo: null, group_id: 1, subgroup: 1, created_at: now, updated_at: now },
      { id: 2, first_name: 'Анна', last_name: 'Козлова', middle_name: 'Игоревна', photo: null, group_id: 1, subgroup: 1, created_at: now, updated_at: now },
      { id: 3, first_name: 'Максим', last_name: 'Новиков', middle_name: 'Павлович', photo: null, group_id: 1, subgroup: 2, created_at: now, updated_at: now },
      { id: 4, first_name: 'Елена', last_name: 'Морозова', middle_name: 'Дмитриевна', photo: null, group_id: 1, subgroup: 2, created_at: now, updated_at: now },
      { id: 5, first_name: 'Артём', last_name: 'Волков', middle_name: 'Сергеевич', photo: null, group_id: 1, subgroup: 3, created_at: now, updated_at: now },
      { id: 6, first_name: 'Ольга', last_name: 'Соколова', middle_name: 'Андреевна', photo: null, group_id: 1, subgroup: 3, created_at: now, updated_at: now },
      { id: 7, first_name: 'Кирилл', last_name: 'Лебедев', middle_name: 'Олегович', photo: null, group_id: 2, subgroup: 1, created_at: now, updated_at: now },
      { id: 8, first_name: 'Мария', last_name: 'Попова', middle_name: 'Викторовна', photo: null, group_id: 2, subgroup: 2, created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('lesson', [
      { id: 1, group_id: 1, subject_name: 'Программирование на Python', subgroup: null, academic_hours: 72, lecturer_id: 1, created_at: now, updated_at: now },
      { id: 2, group_id: 1, subject_name: 'Базы данных', subgroup: 1, academic_hours: 36, lecturer_id: 1, created_at: now, updated_at: now },
      { id: 3, group_id: 2, subject_name: 'Математический анализ', subgroup: null, academic_hours: null, lecturer_id: 2, created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('attendance', [
      { id: 1, lesson_id: 1, student_id: 1, status: 'present', created_at: now, updated_at: now },
      { id: 2, lesson_id: 1, student_id: 2, status: 'present', created_at: now, updated_at: now },
      { id: 3, lesson_id: 1, student_id: 3, status: 'absent', created_at: now, updated_at: now },
      { id: 4, lesson_id: 1, student_id: 4, status: 'late', created_at: now, updated_at: now },
      { id: 5, lesson_id: 1, student_id: 5, status: 'excused', created_at: now, updated_at: now },
      { id: 6, lesson_id: 1, student_id: 6, status: 'present', created_at: now, updated_at: now },
      { id: 7, lesson_id: 2, student_id: 1, status: 'present', created_at: now, updated_at: now },
      { id: 8, lesson_id: 2, student_id: 2, status: 'absent', created_at: now, updated_at: now },
      { id: 9, lesson_id: 3, student_id: 7, status: 'present', created_at: now, updated_at: now },
      { id: 10, lesson_id: 3, student_id: 8, status: 'present', created_at: now, updated_at: now }
    ]);

    await queryInterface.sequelize.query("SELECT setval('lecturer_id_seq', (SELECT MAX(id) FROM lecturer))");
    await queryInterface.sequelize.query("SELECT setval('student_group_id_seq', (SELECT MAX(id) FROM student_group))");
    await queryInterface.sequelize.query("SELECT setval('student_id_seq', (SELECT MAX(id) FROM student))");
    await queryInterface.sequelize.query("SELECT setval('lesson_id_seq', (SELECT MAX(id) FROM lesson))");
    await queryInterface.sequelize.query("SELECT setval('attendance_id_seq', (SELECT MAX(id) FROM attendance))");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('attendance', null, {});
    await queryInterface.bulkDelete('lesson', null, {});
    await queryInterface.bulkDelete('student', null, {});
    await queryInterface.bulkDelete('student_group', null, {});
    await queryInterface.bulkDelete('lecturer', null, {});
  }
};
