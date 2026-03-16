import { DataTypes } from 'sequelize';
import sequelize from '../../db/db.config.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePic: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    specialty: {
        type: DataTypes.STRING,
        defaultValue: "Cardiologist",
    },
    bio: {
        type: DataTypes.TEXT,
        defaultValue: "",
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
    plan: {
        type: DataTypes.ENUM('Free', 'Professional', 'Enterprise'),
        defaultValue: 'Free',
    },
    scanCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    scanResetDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default User;
