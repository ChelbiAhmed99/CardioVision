import { DataTypes } from 'sequelize';
import sequelize from '../../db/db.config.js';

const Analysis = sequelize.define('Analysis', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    patientId: {
        type: DataTypes.STRING,
        defaultValue: "Anonymous",
    },
    videoPath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    metrics: {
        type: DataTypes.JSON, // Use JSON for metrics object
        allowNull: true,
    },
    diagnosis: {
        type: DataTypes.JSON, // Use JSON for diagnosis object
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default Analysis;
