'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS attendance CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS attendance_status CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS attendance_session CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS classroom CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS discipline_plan CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS activity_type CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS discipline CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS group_enrollment CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS academic_year CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS student CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS work_group CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS base_group CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS track CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS specialty CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS lecturer CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS department CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS faculty CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS lesson CASCADE');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS student_group CASCADE');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_lecturer_role"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attendance_status"');

    await queryInterface.createTable('lecturer', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      middle_name: { type: Sequelize.STRING },
      login: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false }
    });

    await queryInterface.createTable('student_group', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });

    await queryInterface.createTable('student', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      middle_name: { type: Sequelize.STRING },
      photo: { type: Sequelize.STRING },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'student_group', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      subgroup: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });

    await queryInterface.createTable('lesson', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'student_group', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      subject_name: { type: Sequelize.STRING, allowNull: false },
      subgroup: { type: Sequelize.INTEGER },
      academic_hours: { type: Sequelize.INTEGER },
      lecturer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'lecturer', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });

    await queryInterface.createTable('attendance', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'lesson', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'student', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'excused'),
        allowNull: false,
        defaultValue: 'present'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('attendance');
    await queryInterface.dropTable('lesson');
    await queryInterface.dropTable('student');
    await queryInterface.dropTable('student_group');
    await queryInterface.dropTable('lecturer');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attendance_status"');
  }
};
