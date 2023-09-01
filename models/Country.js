import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";
import { State } from "./State.js";
export const Country = sequelize.define('countries', {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
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

await Country.sync();
Country.hasMany(State, { foreignKey: 'country_id' });