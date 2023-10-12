import { sequelize } from "../database/sequelize.js";
import { DataTypes } from "sequelize";
import { State } from "./State.js";
import { Country } from "./Country.js";
import { Friendship } from "./Friendship.js";
const NODE_URL = process.env.NODE_URL.toString();

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    country_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    state_id: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone_number:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT(2),
        defaultValue: 1,
        comment: '1 Active 0 Blocked'
    },
    image: {
        type: DataTypes.STRING,
        get() {
            const rawValue = this.getDataValue('image');
            return rawValue ? NODE_URL+`uploads/`+rawValue : null;
        },
        allowNull: true
    },
    is_email_verified:{
        type: DataTypes.TINYINT(2),
        defaultValue:0
    },
    is_phone_verified:{
        type: DataTypes.TINYINT(2),
        defaultValue:0
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

await User.sync();
User.belongsTo(State, { foreignKey: 'state_id' });
User.belongsTo(Country, { foreignKey: 'country_id' });
User.hasMany(Friendship, { as: 'sender', foreignKey: 'sender_id' });
User.hasMany(Friendship, { as: 'receiver', foreignKey: 'receiver_id' });
