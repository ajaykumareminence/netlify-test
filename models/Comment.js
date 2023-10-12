import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";
import { User } from "./User.js";
export const Comment = sequelize.define('comments', {
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
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

await Comment.sync({alter:true});
Comment.belongsTo(User, { foreignKey: 'user_id' });