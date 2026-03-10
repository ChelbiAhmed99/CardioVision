import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../cardiovision.sqlite'),
    logging: false, // Set to true if you want to see SQL queries in console
});

export const connectToSQLite = async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to SQLite database.');

        // Sync models - creating tables if they don't exist. 
        // Note: 'alter: true' is disabled because it is unstable with SQLite 
        // and causes unique constraint errors during table migrations.
        await sequelize.sync({ alter: true });
        console.log('Database tables synchronized.');
    } catch (error) {
        console.error('Unable to connect to the SQLite database:', error);
    }
};

export default sequelize;
