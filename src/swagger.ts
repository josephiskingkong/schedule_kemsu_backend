import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Schedule KEMSU API',
      version: '2.0.0',
      description: 'API для системы учёта посещаемости студентов КемГУ'
    },
    servers: [{ url: '/api', description: 'API сервер' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['login', 'password'],
          properties: {
            login: { type: 'string', example: 'petrov@kemsu.ru' },
            password: { type: 'string', example: 'password123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    first_name: { type: 'string' },
                    last_name: { type: 'string' },
                    middle_name: { type: 'string' },
                    login: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        LecturerProfile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            middle_name: { type: 'string' },
            login: { type: 'string' }
          }
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            middle_name: { type: 'string' },
            photo: { type: 'string', nullable: true },
            group_id: { type: 'integer' },
            subgroup: { type: 'integer', nullable: true }
          }
        },
        CreateStudentRequest: {
          type: 'object',
          required: ['first_name', 'last_name', 'group_id'],
          properties: {
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            middle_name: { type: 'string' },
            photo: { type: 'string' },
            group_id: { type: 'integer' },
            subgroup: { type: 'integer' }
          }
        },
        UpdateStudentRequest: {
          type: 'object',
          properties: {
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            middle_name: { type: 'string' },
            photo: { type: 'string' },
            group_id: { type: 'integer' },
            subgroup: { type: 'integer', nullable: true }
          }
        },
        Group: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string', example: 'ПИ-221' },
            students: { type: 'array', items: { $ref: '#/components/schemas/Student' } }
          }
        },
        CreateGroupRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'ПИ-221' },
            students: {
              type: 'array',
              items: {
                type: 'object',
                required: ['first_name', 'last_name'],
                properties: {
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  middle_name: { type: 'string' },
                  photo: { type: 'string' },
                  subgroup: { type: 'integer' }
                }
              }
            }
          }
        },
        UpdateGroupRequest: {
          type: 'object',
          properties: { name: { type: 'string' } }
        },
        GroupShort: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' }
          }
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            group_id: { type: 'integer' },
            subject_name: { type: 'string' },
            subgroup: { type: 'integer', nullable: true },
            academic_hours: { type: 'integer', nullable: true },
            lecturer_id: { type: 'integer' },
            group: { $ref: '#/components/schemas/GroupShort' },
            attendances: { type: 'array', items: { $ref: '#/components/schemas/AttendanceWithStudent' } }
          }
        },
        CreateLessonRequest: {
          type: 'object',
          required: ['group_id', 'subject_name'],
          properties: {
            group_id: { type: 'integer' },
            subject_name: { type: 'string', example: 'Программирование на Python' },
            subgroup: { type: 'integer', description: 'null=вся группа, 1/2/3=подгруппа' },
            academic_hours: { type: 'integer' }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            lesson_id: { type: 'integer' },
            student_id: { type: 'integer' },
            status: { type: 'string', enum: ['present', 'absent', 'late', 'excused'] }
          }
        },
        AttendanceWithStudent: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            lesson_id: { type: 'integer' },
            student_id: { type: 'integer' },
            status: { type: 'string', enum: ['present', 'absent', 'late', 'excused'] },
            student: { $ref: '#/components/schemas/Student' }
          }
        },
        UpdateAttendanceRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['present', 'absent', 'late', 'excused'] }
          }
        },
        AttendanceStatusItem: {
          type: 'object',
          properties: {
            value: { type: 'string' },
            label: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Авторизация'],
          summary: 'Вход в систему',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
          responses: {
            '200': { description: 'Успешный вход', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
            '401': { description: 'Неверный логин или пароль' }
          }
        }
      },
      '/auth/profile': {
        get: {
          tags: ['Авторизация'],
          summary: 'Профиль текущего пользователя',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Профиль', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/LecturerProfile' } } } } } }
          }
        }
      },
      '/groups': {
        get: {
          tags: ['Группы'],
          summary: 'Все группы со студентами',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Список групп' } }
        },
        post: {
          tags: ['Группы'],
          summary: 'Создать группу с опциональным списком студентов',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateGroupRequest' } } } },
          responses: { '201': { description: 'Группа создана' }, '409': { description: 'Группа уже существует' } }
        }
      },
      '/groups/{id}': {
        get: {
          tags: ['Группы'],
          summary: 'Группа по ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Группа' }, '404': { description: 'Не найдена' } }
        },
        put: {
          tags: ['Группы'],
          summary: 'Обновить название группы',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateGroupRequest' } } } },
          responses: { '200': { description: 'Обновлена' }, '404': { description: 'Не найдена' } }
        },
        delete: {
          tags: ['Группы'],
          summary: 'Удалить группу',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Удалена' }, '404': { description: 'Не найдена' } }
        }
      },
      '/students/group/{groupId}': {
        get: {
          tags: ['Студенты'],
          summary: 'Студенты группы (фильтр по подгруппе)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'groupId', in: 'path', required: true, schema: { type: 'integer' } },
            { name: 'subgroup', in: 'query', required: false, schema: { type: 'integer' }, description: '1, 2 или 3' }
          ],
          responses: { '200': { description: 'Список студентов' } }
        }
      },
      '/students': {
        post: {
          tags: ['Студенты'],
          summary: 'Добавить студента',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateStudentRequest' } } } },
          responses: { '201': { description: 'Студент добавлен' }, '400': { description: 'Ошибка валидации' } }
        }
      },
      '/students/{id}': {
        put: {
          tags: ['Студенты'],
          summary: 'Обновить студента',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStudentRequest' } } } },
          responses: { '200': { description: 'Обновлён' }, '404': { description: 'Не найден' } }
        },
        delete: {
          tags: ['Студенты'],
          summary: 'Удалить студента',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Удалён' }, '404': { description: 'Не найден' } }
        }
      },
      '/lessons': {
        get: {
          tags: ['Занятия'],
          summary: 'Мои занятия',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Список занятий' } }
        },
        post: {
          tags: ['Занятия'],
          summary: 'Создать занятие (авто-создание записей посещаемости)',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateLessonRequest' } } } },
          responses: { '201': { description: 'Занятие создано' }, '400': { description: 'Ошибка валидации' }, '404': { description: 'Группа не найдена' } }
        }
      },
      '/lessons/{id}': {
        get: {
          tags: ['Занятия'],
          summary: 'Занятие с посещаемостью',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Занятие' }, '404': { description: 'Не найдено' } }
        },
        delete: {
          tags: ['Занятия'],
          summary: 'Удалить занятие',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Удалено' }, '404': { description: 'Не найдено' } }
        }
      },
      '/attendance/{id}': {
        put: {
          tags: ['Посещаемость'],
          summary: 'Изменить статус посещаемости',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateAttendanceRequest' } } } },
          responses: { '200': { description: 'Обновлён' }, '400': { description: 'Невалидный статус' }, '404': { description: 'Не найдена' } }
        }
      },
      '/attendance/statuses': {
        get: {
          tags: ['Посещаемость'],
          summary: 'Список статусов посещаемости',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Статусы' } }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
