import { DataTypes } from 'sequelize';
import sequelize from '../../db/db.config.js';

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("info", "warning", "success", "error"),
        defaultValue: "info",
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

export default Notification;
