import app from './app';
import sequelize from './db';
import config from './config';

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено');

    await sequelize.sync({ alter: false });
    console.log('Модели синхронизированы');

    app.listen(config.port, () => {
      console.log(`Сервер запущен на порту ${config.port}`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    process.exit(1);
  }
};

start();
