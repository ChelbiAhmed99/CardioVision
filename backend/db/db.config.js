import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../cardiovision.sqlite'),
        logging: false,
    });

export const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Successfully connected to ${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite'} database.`);

        // Sync models
        await sequelize.sync();
        console.log('Database tables synchronized.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default sequelize;
