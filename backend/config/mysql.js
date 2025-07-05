/*import { Sequelize } from 'sequelize';
import dotenv from "dotenv";


dotenv.config();
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
*/

import { Sequelize } from 'sequelize';
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false, 
});

const connectAndSyncDB = async () => {
    try {
       
        await sequelize.authenticate();
        console.log('✅ Conexão com o MySQL estabelecida com sucesso.');

        await sequelize.sync({ alter: true });
        console.log('🔄 Modelos sincronizados com o banco de dados.');

    } catch (error) {
        console.error('❌ Erro ao conectar ou sincronizar com o banco de dados:', error);

        process.exit(1); 
    }
};

export { sequelize, connectAndSyncDB };