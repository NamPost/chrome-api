import Sequelize from 'sequelize';
import process from 'process';
import apiKeys from "./apiKeys.js";
import jobs from "./jobs.js";
import dotenv from "dotenv";
import mysql2 from "mysql2";


dotenv.config()

const REJECT_UNAUTHORIZED = process.env.DATABASE_USE_SSL == "true"

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: process.env.DATABASE_TYPE,
		dialectModule: mysql2,
		operatorsAliases: false,
		pool: process.env.pool,
		logging: false,
		dialectOptions: {
			ssl: {
				rejectUnauthorized: REJECT_UNAUTHORIZED,        
			}
		}
	}
);

sequelize.authenticate();

const db = {
	'apiKeys': apiKeys(sequelize, Sequelize.DataTypes),
	'jobs': jobs(sequelize, Sequelize.DataTypes)
};

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;