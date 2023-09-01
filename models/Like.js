import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";
import { User } from "./User.js";
export const Like = sequelize.define('likes', {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    user_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: false
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

await Like.sync({alter:true});
Like.belongsTo(User, { foreignKey: 'user_id' });