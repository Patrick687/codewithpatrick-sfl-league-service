import { Sequelize } from 'sequelize';
import serviceConfig from './serviceConfig';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: serviceConfig.DB_HOST,
    port: serviceConfig.DB_PORT,
    database: serviceConfig.DB_NAME,
    username: serviceConfig.DB_USER,
    password: serviceConfig.DB_PASSWORD,
    logging: false,
    pool: { // What is the purpose of this?
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

export const connectToDatabase = async (): Promise<void> => {
    try {
        //also print the connection information
        console.log(`🔗 Connecting to the database at ${serviceConfig.DB_HOST}:${serviceConfig.DB_PORT}/${serviceConfig.DB_NAME}...`);
        await sequelize.authenticate();
        console.log('📊 Database connection established successfully')
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        throw error;
    }
};

export default sequelize;