import User from '../models/sql/user.model.js';
import bcrypt from 'bcryptjs';

export async function initAdmin() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Check if user exists
        let user = await User.findOne({ where: { email: 'admin@cardiovision.com' } });

        if (user) {
            user.password = hashedPassword;
            user.role = 'admin';
            user.fullName = 'System Admin';
            await user.save();
            console.log('✅ Admin account verified/updated: admin@cardiovision.com');
        } else {
            await User.create({
                fullName: 'System Admin',
                email: 'admin@cardiovision.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ New admin account created: admin@cardiovision.com');
        }
    } catch (e) {
        console.error('❌ Error initializing admin:', e.message);
    }
}
