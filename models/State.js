import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";
export const State = sequelize.define('states', {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    country_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

await State.sync({alter:true});