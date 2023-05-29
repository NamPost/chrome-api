import Sequelize from 'sequelize';
import process from 'process';
import apiKeys from "./apiKeys.js";
import jobs from "./jobs.js";
import dotenv from "dotenv";
import mysql2 from "mysql2";
import pg from "pg";

dotenv.config()

const REJECT_UNAUTHORIZED = process.env.DATABASE_USE_SSL == "true"
let dialectModule = undefined
let dialectOptions = {}

if (process.env.DATABASE_TYPE == "mysql"){
	dialectModule = mysql2
}

if (process.env.DATABASE_TYPE == "postgres"){
	dialectModule = pg
}

// set the ssl options
if(REJECT_UNAUTHORIZED){
	dialectOptions.ssl = {
		rejectUnauthorized: REJECT_UNAUTHORIZED,        
	}
}

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: process.env.DATABASE_TYPE,
		dialectModule: dialectModule,
		operatorsAliases: false,
		pool: process.env.pool,
		logging: false,
		dialectOptions: dialectOptions
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