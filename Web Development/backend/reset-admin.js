import User from './models/sql/user.model.js';
import bcrypt from 'bcryptjs';
import sequelize from './db/db.config.js';

async function reset() {
    try {
        await sequelize.sync({ alter: true });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Check if user exists
        let user = await User.findOne({ where: { email: 'admin@cardiovision.com' } });

        if (user) {
            user.password = hashedPassword;
            user.role = 'admin';
            user.fullName = 'System Admin';
            await user.save();
            console.log('SUCCESS: Updated existing admin account: admin@cardiovision.com / admin123');
        } else {
            await User.create({
                fullName: 'System Admin',
                email: 'admin@cardiovision.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('SUCCESS: Created new admin account: admin@cardiovision.com / admin123');
        }
    } catch (e) {
        console.error('ERROR resetting admin:', e.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

reset();
