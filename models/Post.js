import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";
const NODE_URL = process.env.NODE_URL.toString();
import { Like } from "./Like.js";
import { User } from "./User.js";
export const Post = sequelize.define('posts', {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
        get() {
            const rawValue = this.getDataValue('image');
            const parsed = JSON.parse(rawValue);
            if(parsed?.length > 0){
                const rr = []
                for(const value of parsed){
                    rr.push(NODE_URL+`uploads/`+value)
                }
                return rr;
            }
            return parsed;
        },
        allowNull: true
    }

}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

await Post.sync();
Post.belongsTo(User, { foreignKey: 'user_id' })
Post.hasMany(Like, { foreignKey: 'post_id' })