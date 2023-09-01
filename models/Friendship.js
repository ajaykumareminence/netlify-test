import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";
export const Friendship = sequelize.define('friendships', {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    sender_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    receiver_id:{
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    is_confirmed: {
        type: DataTypes.TINYINT(2),
        defaultValue: 0
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

await Friendship.sync();