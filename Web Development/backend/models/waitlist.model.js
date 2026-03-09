import { DataTypes } from 'sequelize';
import sequelize from '../db/db.config.js';

const Waitlist = sequelize.define('Waitlist', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'contacted', 'accepted'),
        defaultValue: 'pending',
    },
}, {
    timestamps: true,
});

export default Waitlist;
