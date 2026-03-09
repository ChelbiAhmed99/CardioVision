import { DataTypes } from 'sequelize';
import sequelize from '../../db/db.config.js';

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    adminId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    adminName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false // e.g., 'UPDATE_ROLE', 'DELETE_USER', 'UPDATE_SETTINGS'
    },
    targetType: {
        type: DataTypes.STRING,
        allowNull: true // e.g., 'USER', 'SETTINGS'
    },
    targetId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    updatedAt: false // Audit logs are immutable
});

export default AuditLog;
