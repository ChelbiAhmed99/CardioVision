import { DataTypes } from 'sequelize';
import sequelize from '../../db/db.config.js';

const Video = sequelize.define('Video', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    video: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    }
}, {
    timestamps: true,
});

export default Video;
