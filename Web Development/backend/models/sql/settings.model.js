import { DataTypes } from 'sequelize';
import sequelize from '../../db/db.config.js';

const Settings = sequelize.define('Settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    siteName: {
        type: DataTypes.STRING,
        defaultValue: "CardioVision"
    },
    maintenanceMode: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    allowSignups: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    requireEmailVerification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    maxUploadSize: {
        type: DataTypes.INTEGER,
        defaultValue: 50 // MB
    },
    apiRateLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true
});

export default Settings;
