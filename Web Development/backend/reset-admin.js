import User from './models/sql/user.model.js';
import AuditLog from './models/sql/audit.model.js';
import Settings from './models/sql/settings.model.js';
import Video from './models/sql/videos.model.js';
import Notification from './models/sql/notification.model.js';
import Analysis from './models/sql/analysis.model.js';
import Feedback from './models/sql/feedback.model.js';
import bcrypt from 'bcryptjs';
import sequelize from './db/db.config.js';

async function reset() {
    try {
        await sequelize.sync();
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
