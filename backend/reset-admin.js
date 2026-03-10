import { initAdmin } from './utils/initAdmin.js';
import sequelize from './db/db.config.js';

async function reset() {
    try {
        await sequelize.sync();
        await initAdmin();
        console.log('SUCCESS: Admin account reset process complete.');
    } catch (e) {
        console.error('ERROR resetting admin:', e.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

reset();
