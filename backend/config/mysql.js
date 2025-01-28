import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao MySQL com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error);
    }
};

export { sequelize, connectDB };
