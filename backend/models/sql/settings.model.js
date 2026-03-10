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
    heroTitle: {
        type: DataTypes.STRING,
        defaultValue: "GLS Analysis"
    },
    heroHighlight: {
        type: DataTypes.STRING,
        defaultValue: "In Seconds."
    },
    heroSubtitle: {
        type: DataTypes.TEXT,
        defaultValue: "The first clinical-grade AI platform for automated myocardial segmentation and quantitative biomechanical assessment."
    },
    announcementText: {
        type: DataTypes.STRING,
        defaultValue: "Next-Gen Echocardiography AI"
    },
    contactEmail: {
        type: DataTypes.STRING,
        defaultValue: "contact@cardiovision.com"
    },
    footerText: {
        type: DataTypes.STRING,
        defaultValue: "© 2026 CardioVision AI. All rights reserved."
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true
});

export default Settings;
