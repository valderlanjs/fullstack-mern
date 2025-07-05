// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from "dotenv";

dotenv.config();

// Verifica se a URL do banco de dados foi definida no .env
if (!process.env.DATABASE_URL) {
    throw new Error('A variável de ambiente DATABASE_URL não foi definida.');
}

// O Sequelize entende a URL de conexão diretamente!
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    
    // Opcional, mas recomendado para produção
    // Habilita o uso de SSL para conexões seguras com o banco de dados
    /*dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Pode ser necessário para alguns provedores de nuvem
        }
    }*/
});

const connectAndSyncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso usando a URL.');

        await sequelize.sync({ alter: true });
        console.log('🔄 Modelos sincronizados com o banco de dados PostgreSQL.');

    } catch (error) {
        console.error('❌ Erro ao conectar ou sincronizar com o PostgreSQL:', error);
        process.exit(1);
    }
};

export { sequelize, connectAndSyncDB };