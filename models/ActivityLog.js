import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";

export const ActivityLog = sequelize.define('activities', {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

await ActivityLog.sync({alter:true});