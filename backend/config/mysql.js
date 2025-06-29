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
    logging: false, // Opcional: mude para 'console.log' para ver as queries SQL geradas pelo Sequelize
});

/**
 * Função unificada que conecta ao banco de dados e sincroniza os modelos.
 * Isso garante que as tabelas no banco de dados correspondam aos modelos definidos no código.
 */
const connectAndSyncDB = async () => {
    try {
        // 1. Tenta autenticar a conexão com o banco de dados
        await sequelize.authenticate();
        console.log('✅ Conexão com o MySQL estabelecida com sucesso.');

        // 2. Sincroniza todos os modelos definidos com o banco de dados.
        // { alter: true } modifica as tabelas para corresponderem aos modelos sem apagar dados.
        // É ideal para desenvolvimento.
        await sequelize.sync({ alter: true });
        console.log('🔄 Modelos sincronizados com o banco de dados.');

    } catch (error) {
        console.error('❌ Erro ao conectar ou sincronizar com o banco de dados:', error);
        // Encerra o processo se não conseguir conectar ao DB, pois a aplicação não pode funcionar.
        process.exit(1); 
    }
};

export { sequelize, connectAndSyncDB };