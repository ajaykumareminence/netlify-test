import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";

export const AuthLog = sequelize.define('auth_logs', {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

await AuthLog.sync();