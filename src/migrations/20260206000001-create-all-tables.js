'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('faculty', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      short_name: { type: Sequelize.STRING(50), allowNull: false },
      full_name: { type: Sequelize.STRING(255), allowNull: false }
    });

    await queryInterface.createTable('department', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      short_name: { type: Sequelize.STRING(50), allowNull: false },
      full_name: { type: Sequelize.STRING(255), allowNull: false },
      faculty_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'faculty', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    });

    await queryInterface.createTable('lecturer', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: Sequelize.STRING(100), allowNull: false },
      last_name: { type: Sequelize.STRING(100), allowNull: false },
      middle_name: { type: Sequelize.STRING(100), allowNull: true },
      login: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      role: {
        type: Sequelize.ENUM('lecturer', 'head_of_department'),
        allowNull: false,
        defaultValue: 'lecturer'
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'department', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    });

    await queryInterface.createTable('specialty', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(255), allowNull: false }
    });

    await queryInterface.createTable('track', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(255), allowNull: false },
      specialty_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'specialty', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    });

    await queryInterface.createTable('base_group', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      intake_year: { type: Sequelize.INTEGER, allowNull: false },
      course_number: { type: Sequelize.INTEGER, allowNull: false },
      track_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'track', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    });

    await queryInterface.createTable('work_group', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      base_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'base_group', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true }
    });

    await queryInterface.createTable('student', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: Sequelize.STRING(100), allowNull: false },
      last_name: { type: Sequelize.STRING(100), allowNull: false },
      middle_name: { type: Sequelize.STRING(100), allowNull: true },
      date_birth: { type: Sequelize.DATEONLY, allowNull: true },
      age: { type: Sequelize.INTEGER, allowNull: true },
      base_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'base_group', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    });

    await queryInterface.createTable('academic_year', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      date_start: { type: Sequelize.DATEONLY, allowNull: false },
      date_end: { type: Sequelize.DATEONLY, allowNull: false },
      is_current: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
    });

    await queryInterface.createTable('group_enrollment', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'student', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      work_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'work_group', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      academic_year_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'academic_year', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      enrollment_date: { type: Sequelize.DATEONLY, allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
    });

    await queryInterface.createTable('discipline', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(255), allowNull: false }
    });

    await queryInterface.createTable('activity_type', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      short_name: { type: Sequelize.STRING(20), allowNull: false },
      full_name: { type: Sequelize.STRING(100), allowNull: false }
    });

    await queryInterface.createTable('discipline_plan', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      lecturer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'lecturer', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      work_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'work_group', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      discipline_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'discipline', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      activity_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'activity_type', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      academic_year_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'academic_year', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      academic_hours: { type: Sequelize.INTEGER, allowNull: true }
    });

    await queryInterface.createTable('classroom', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(50), allowNull: false }
    });

    await queryInterface.createTable('attendance_session', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      discipline_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'discipline_plan', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      pair_number: { type: Sequelize.INTEGER, allowNull: true },
      classroom_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'classroom', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });

    await queryInterface.createTable('attendance_status', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(50), allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true }
    });

    await queryInterface.createTable('attendance', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'student', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      attendance_session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'attendance_session', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      attendance_status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'attendance_status', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      attendance_timestamp: { type: Sequelize.DATE, allowNull: true },
      comment: { type: Sequelize.TEXT, allowNull: true }
    });

    await queryInterface.addIndex('attendance', ['student_id', 'attendance_session_id'], {
      unique: true,
      name: 'attendance_student_session_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('attendance');
    await queryInterface.dropTable('attendance_status');
    await queryInterface.dropTable('attendance_session');
    await queryInterface.dropTable('classroom');
    await queryInterface.dropTable('discipline_plan');
    await queryInterface.dropTable('activity_type');
    await queryInterface.dropTable('discipline');
    await queryInterface.dropTable('group_enrollment');
    await queryInterface.dropTable('academic_year');
    await queryInterface.dropTable('student');
    await queryInterface.dropTable('work_group');
    await queryInterface.dropTable('base_group');
    await queryInterface.dropTable('track');
    await queryInterface.dropTable('specialty');
    await queryInterface.dropTable('lecturer');
    await queryInterface.dropTable('department');
    await queryInterface.dropTable('faculty');
  }
};
