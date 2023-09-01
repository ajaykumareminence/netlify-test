// import { config } from "../config/dbConfig.js";
import Sequelize from "sequelize";
const { DATABASE, DB_USER, PASSWORD, HOST, DIALECT } = process.env;
export const sequelize = new Sequelize(DATABASE, DB_USER, PASSWORD, {
    host: HOST,
    dialect: DIALECT,
    logging: false,
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
