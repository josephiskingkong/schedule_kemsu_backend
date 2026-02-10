import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Schedule KEMSU API',
      version: '1.0.0',
      description: 'API для системы учёта посещаемости студентов КемГУ',
      contact: {
        name: 'КемГУ'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API сервер'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT токен авторизации. Получите через POST /auth/login'
        }
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
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: { $ref: '#/components/schemas/LecturerShort' }
              }
            }
          }
        },
        LecturerShort: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            first_name: { type: 'string', example: 'Иван' },
            last_name: { type: 'string', example: 'Петров' },
            middle_name: { type: 'string', example: 'Сергеевич' },
            login: { type: 'string', example: 'petrov@kemsu.ru' },
            role: { type: 'string', enum: ['lecturer', 'head_of_department'], example: 'lecturer' },
            department_id: { type: 'integer', example: 1 }
          }
        },
        LecturerProfile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            middle_name: { type: 'string' },
            login: { type: 'string' },
            role: { type: 'string', enum: ['lecturer', 'head_of_department'] },
            department_id: { type: 'integer' },
            department: { $ref: '#/components/schemas/Department' }
          }
        },
        Department: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            short_name: { type: 'string', example: 'ИВТ' },
            full_name: { type: 'string', example: 'Кафедра информатики и вычислительной техники' },
            faculty_id: { type: 'integer', example: 1 }
          }
        },
        BaseGroup: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'ПМИ-21' },
            intake_year: { type: 'integer', example: 2021 },
            course_number: { type: 'integer', example: 4 },
            track: { $ref: '#/components/schemas/Track' },
            workGroups: {
              type: 'array',
              items: { $ref: '#/components/schemas/WorkGroupShort' }
            }
          }
        },
        Track: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Системное программирование' },
            specialty_id: { type: 'integer', example: 1 },
            specialty: { $ref: '#/components/schemas/Specialty' }
          }
        },
        Specialty: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Прикладная математика и информатика' }
          }
        },
        WorkGroupShort: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'ПМИ-21 (подгруппа 1)' },
            comment: { type: 'string', nullable: true, example: 'Первая подгруппа' }
          }
        },
        WorkGroupWithPlans: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            base_group_id: { type: 'integer' },
            name: { type: 'string' },
            comment: { type: 'string', nullable: true },
            disciplinePlans: {
              type: 'array',
              items: { $ref: '#/components/schemas/DisciplinePlanShort' }
            }
          }
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            first_name: { type: 'string', example: 'Анна' },
            last_name: { type: 'string', example: 'Иванова' },
            middle_name: { type: 'string', nullable: true, example: 'Петровна' },
            date_birth: { type: 'string', format: 'date', example: '2003-05-15' },
            age: { type: 'integer', example: 22 }
          }
        },
        DisciplinePlanShort: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            lecturer_id: { type: 'integer' },
            work_group_id: { type: 'integer' },
            discipline_id: { type: 'integer' },
            activity_type_id: { type: 'integer' },
            academic_year_id: { type: 'integer' },
            academic_hours: { type: 'integer' },
            discipline: { $ref: '#/components/schemas/Discipline' },
            activityType: { $ref: '#/components/schemas/ActivityType' }
          }
        },
        DisciplinePlanFull: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            lecturer_id: { type: 'integer' },
            work_group_id: { type: 'integer' },
            discipline_id: { type: 'integer' },
            activity_type_id: { type: 'integer' },
            academic_year_id: { type: 'integer' },
            academic_hours: { type: 'integer' },
            discipline: { $ref: '#/components/schemas/Discipline' },
            activityType: { $ref: '#/components/schemas/ActivityType' },
            lecturer: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                middle_name: { type: 'string' }
              }
            },
            workGroup: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                base_group_id: { type: 'integer' },
                name: { type: 'string' },
                comment: { type: 'string', nullable: true },
                baseGroup: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    intake_year: { type: 'integer' },
                    course_number: { type: 'integer' },
                    track_id: { type: 'integer' }
                  }
                }
              }
            },
            sessions: {
              type: 'array',
              items: { $ref: '#/components/schemas/AttendanceSessionWithClassroom' }
            }
          }
        },
        Discipline: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Базы данных' }
          }
        },
        ActivityType: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            short_name: { type: 'string', example: 'Лек' },
            full_name: { type: 'string', example: 'Лекция' }
          }
        },
        AttendanceSession: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            discipline_plan_id: { type: 'integer', example: 1 },
            date: { type: 'string', format: 'date', example: '2026-02-02' },
            pair_number: { type: 'integer', nullable: true, example: 1 },
            classroom_id: { type: 'integer', nullable: true, example: 1 }
          }
        },
        AttendanceSessionWithClassroom: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            discipline_plan_id: { type: 'integer' },
            date: { type: 'string', format: 'date' },
            pair_number: { type: 'integer', nullable: true },
            classroom_id: { type: 'integer', nullable: true },
            classroom: { $ref: '#/components/schemas/Classroom' }
          }
        },
        AttendanceStatus: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Присутствует' },
            comment: { type: 'string', nullable: true }
          }
        },
        Classroom: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '301а' }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            student_id: { type: 'integer' },
            attendance_session_id: { type: 'integer' },
            attendance_status_id: { type: 'integer' },
            attendance_timestamp: { type: 'string', format: 'date-time' },
            comment: { type: 'string', nullable: true }
          }
        },
        CreateSessionRequest: {
          type: 'object',
          required: ['discipline_plan_id', 'date'],
          properties: {
            discipline_plan_id: { type: 'integer', example: 1 },
            date: { type: 'string', format: 'date', example: '2026-02-10' },
            pair_number: { type: 'integer', nullable: true, example: 2 },
            classroom_id: { type: 'integer', nullable: true, example: 1 }
          }
        },
        MarkAttendanceRequest: {
          type: 'object',
          required: ['records'],
          properties: {
            records: {
              type: 'array',
              items: {
                type: 'object',
                required: ['student_id', 'attendance_status_id'],
                properties: {
                  student_id: { type: 'integer', example: 1 },
                  attendance_status_id: { type: 'integer', example: 1 },
                  comment: { type: 'string', nullable: true, example: '' }
                }
              }
            }
          }
        },
        SessionAttendanceItem: {
          type: 'object',
          properties: {
            student: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                middle_name: { type: 'string' }
              }
            },
            attendance: {
              nullable: true,
              type: 'object',
              properties: {
                id: { type: 'integer' },
                student_id: { type: 'integer' },
                attendance_session_id: { type: 'integer' },
                attendance_status_id: { type: 'integer' },
                attendance_timestamp: { type: 'string', format: 'date-time' },
                comment: { type: 'string', nullable: true },
                attendanceStatus: { $ref: '#/components/schemas/AttendanceStatus' }
              }
            }
          }
        },
        StatsSummaryItem: {
          type: 'object',
          properties: {
            discipline_plan_id: { type: 'integer' },
            discipline: { type: 'string', example: 'Базы данных' },
            activity_type: { type: 'string', example: 'Лаб' },
            work_group: { type: 'string', example: 'ПМИ-21 (подгруппа 1)' },
            base_group: { type: 'string', example: 'ПМИ-21' },
            total_sessions: { type: 'integer', example: 3 },
            academic_hours: { type: 'integer', example: 36 }
          }
        },
        DisciplinePlanStats: {
          type: 'object',
          properties: {
            discipline_plan: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                discipline: { $ref: '#/components/schemas/Discipline' },
                activity_type: { $ref: '#/components/schemas/ActivityType' },
                work_group: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    baseGroup: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            total_sessions: { type: 'integer' },
            students: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  student: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      last_name: { type: 'string' },
                      first_name: { type: 'string' },
                      middle_name: { type: 'string' }
                    }
                  },
                  total_sessions: { type: 'integer' },
                  total_marked: { type: 'integer' },
                  status_counts: {
                    type: 'object',
                    additionalProperties: { type: 'integer' },
                    example: { 'Присутствует': 5, 'Отсутствует': 1, 'Уважительная': 0, 'Опоздание': 1 }
                  }
                }
              }
            }
          }
        },
        StudentStats: {
          type: 'object',
          properties: {
            student: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                last_name: { type: 'string' },
                first_name: { type: 'string' },
                middle_name: { type: 'string' }
              }
            },
            total_records: { type: 'integer' },
            status_counts: {
              type: 'object',
              additionalProperties: { type: 'integer' }
            },
            details: {
              type: 'array',
              items: { $ref: '#/components/schemas/Attendance' }
            }
          }
        }
      }
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Авторизация'],
          summary: 'Авторизация пользователя',
          description: 'Аутентификация преподавателя по логину и паролю. Возвращает JWT-токен.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Успешная авторизация',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginResponse' }
                }
              }
            },
            '400': {
              description: 'Логин и пароль обязательны',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '401': {
              description: 'Неверный логин или пароль',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/auth/profile': {
        get: {
          tags: ['Авторизация'],
          summary: 'Получить профиль текущего пользователя',
          description: 'Возвращает данные авторизованного преподавателя с информацией о кафедре.',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Профиль пользователя',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/LecturerProfile' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/groups': {
        get: {
          tags: ['Группы'],
          summary: 'Получить список групп',
          description: 'Преподаватель видит только группы, для которых у него есть планы дисциплин. Заведующий кафедрой видит все группы.',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Список базовых групп с подгруппами',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/BaseGroup' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/groups/{baseGroupId}/work-groups': {
        get: {
          tags: ['Группы'],
          summary: 'Получить подгруппы базовой группы',
          description: 'Возвращает рабочие подгруппы с привязанными планами дисциплин. Преподаватель видит только свои планы.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'baseGroupId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID базовой группы'
            }
          ],
          responses: {
            '200': {
              description: 'Список подгрупп с планами дисциплин',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/WorkGroupWithPlans' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/students/work-group/{workGroupId}': {
        get: {
          tags: ['Студенты'],
          summary: 'Студенты рабочей подгруппы',
          description: 'Возвращает список студентов, записанных в указанную рабочую подгруппу в текущем учебном году.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'workGroupId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID рабочей подгруппы'
            }
          ],
          responses: {
            '200': {
              description: 'Список студентов',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Student' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/students/base-group/{baseGroupId}': {
        get: {
          tags: ['Студенты'],
          summary: 'Студенты базовой группы',
          description: 'Возвращает всех студентов, принадлежащих к указанной базовой группе.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'baseGroupId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID базовой группы'
            }
          ],
          responses: {
            '200': {
              description: 'Список студентов',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Student' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/schedule': {
        get: {
          tags: ['Расписание'],
          summary: 'Получить расписание',
          description: 'Возвращает планы дисциплин с сессиями. Преподаватель видит только свои. Заведующий кафедрой — все. Можно фильтровать по датам.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'date_from',
              in: 'query',
              required: false,
              schema: { type: 'string', format: 'date' },
              description: 'Начало диапазона дат (включительно)'
            },
            {
              name: 'date_to',
              in: 'query',
              required: false,
              schema: { type: 'string', format: 'date' },
              description: 'Конец диапазона дат (включительно)'
            }
          ],
          responses: {
            '200': {
              description: 'Список планов с сессиями',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/DisciplinePlanFull' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/schedule/disciplines': {
        get: {
          tags: ['Расписание'],
          summary: 'Получить дисциплины',
          description: 'Возвращает планы дисциплин без сессий. Преподаватель — только свои, заведующий — все.',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Список планов дисциплин',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/DisciplinePlanFull' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/schedule/discipline-plan/{disciplinePlanId}/sessions': {
        get: {
          tags: ['Расписание'],
          summary: 'Сессии плана дисциплины',
          description: 'Возвращает все сессии (занятия) для указанного плана дисциплины с информацией об аудиториях.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'disciplinePlanId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID плана дисциплины'
            }
          ],
          responses: {
            '200': {
              description: 'Список сессий',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/AttendanceSessionWithClassroom' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '403': {
              description: 'Нет доступа к этому плану',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '404': {
              description: 'План дисциплины не найден',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/attendance/statuses': {
        get: {
          tags: ['Посещаемость'],
          summary: 'Получить статусы посещаемости',
          description: 'Возвращает все доступные статусы посещаемости (Присутствует, Отсутствует, Уважительная, Опоздание).',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Список статусов',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/AttendanceStatus' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/attendance/classrooms': {
        get: {
          tags: ['Посещаемость'],
          summary: 'Получить список аудиторий',
          description: 'Возвращает все аудитории, отсортированные по названию.',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Список аудиторий',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Classroom' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/attendance/sessions': {
        post: {
          tags: ['Посещаемость'],
          summary: 'Создать сессию посещаемости',
          description: 'Создаёт новую сессию (занятие) для плана дисциплины. Преподаватель может создать только для своего плана.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateSessionRequest' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Сессия создана',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/AttendanceSession' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '403': {
              description: 'Нет доступа к этому плану',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '404': {
              description: 'План дисциплины не найден',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/attendance/sessions/{sessionId}': {
        get: {
          tags: ['Посещаемость'],
          summary: 'Получить посещаемость сессии',
          description: 'Возвращает список студентов подгруппы с их отметками посещаемости для указанной сессии.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'sessionId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID сессии посещаемости'
            }
          ],
          responses: {
            '200': {
              description: 'Посещаемость сессии',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/SessionAttendanceItem' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '403': {
              description: 'Нет доступа',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '404': {
              description: 'Сессия не найдена',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/attendance/sessions/{sessionId}/mark': {
        post: {
          tags: ['Посещаемость'],
          summary: 'Отметить посещаемость',
          description: 'Массовая отметка посещаемости студентов на сессии. Если отметка уже существует — обновляет её.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'sessionId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID сессии посещаемости'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MarkAttendanceRequest' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Отметки сохранены',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Attendance' }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Необходимо передать массив records',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '403': {
              description: 'Нет доступа',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '404': {
              description: 'Сессия не найдена',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/statistics/summary': {
        get: {
          tags: ['Статистика'],
          summary: 'Сводка по дисциплинам',
          description: 'Возвращает краткую сводку по каждому плану дисциплины: название, тип, группа, количество сессий, часы. Преподаватель — только свои, заведующий — все.',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Сводка статистики',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/StatsSummaryItem' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/statistics/discipline-plan/{disciplinePlanId}': {
        get: {
          tags: ['Статистика'],
          summary: 'Статистика по плану дисциплины',
          description: 'Подробная статистика посещаемости для каждого студента по указанному плану дисциплины. Включает подсчёт по каждому статусу.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'disciplinePlanId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID плана дисциплины'
            }
          ],
          responses: {
            '200': {
              description: 'Детальная статистика',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/DisciplinePlanStats' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '403': {
              description: 'Нет доступа (преподаватель не может видеть чужой план)',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '404': {
              description: 'План дисциплины не найден',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/statistics/student/{studentId}': {
        get: {
          tags: ['Статистика'],
          summary: 'Статистика студента',
          description: 'Посещаемость конкретного студента. Можно фильтровать по плану дисциплины.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'studentId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID студента'
            },
            {
              name: 'discipline_plan_id',
              in: 'query',
              required: false,
              schema: { type: 'integer' },
              description: 'Фильтр по ID плана дисциплины'
            }
          ],
          responses: {
            '200': {
              description: 'Статистика студента',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/StudentStats' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Не авторизован',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            '404': {
              description: 'Студент не найден',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Авторизация', description: 'Аутентификация и профиль пользователя' },
      { name: 'Группы', description: 'Управление группами и подгруппами' },
      { name: 'Студенты', description: 'Списки студентов' },
      { name: 'Расписание', description: 'Расписание и планы дисциплин' },
      { name: 'Посещаемость', description: 'Учёт посещаемости студентов' },
      { name: 'Статистика', description: 'Статистика и аналитика посещаемости' }
    ]
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
