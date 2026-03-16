import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../cardiovision.sqlite'),
    logging: false,
});

export const connectToSQLite = async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to SQLite database.');

        await sequelize.sync({ alter: true });
        console.log('Database tables synchronized (alter: true).');
    } catch (error) {
        console.error('Unable to connect to the SQLite database:', error);
    }
};

export default sequelize;
