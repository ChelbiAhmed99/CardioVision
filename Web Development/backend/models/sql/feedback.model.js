import { DataTypes } from 'sequelize';
import sequelize from '../../db/db.config.js';

const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    submissionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    lastUpdated: {
        type: DataTypes.STRING
    },
    profile: {
        type: DataTypes.STRING
    },
    experienceLevel: {
        type: DataTypes.STRING
    },
    familiarityEF: {
        type: DataTypes.STRING
    },
    familiarityGLS: {
        type: DataTypes.STRING
    },
    usefulness: {
        type: DataTypes.STRING
    },
    easeOfUse: {
        type: DataTypes.STRING
    },
    interestInUse: {
        type: DataTypes.STRING
    },
    suggestions: {
        type: DataTypes.TEXT
    },
    email: {
        type: DataTypes.STRING
    }
});

export default Feedback;
