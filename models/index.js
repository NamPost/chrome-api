import Sequelize from 'sequelize';
import process from 'process';
import apiKeys from "./apiKeys.js";
import dotenv from "dotenv";
import mysql2 from "mysql2";


dotenv.config()

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
		logging: false
	}
);

const db = {
	'apiKeys': apiKeys(sequelize, Sequelize.DataTypes)
};

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

// import { readdirSync } from "fs";
// import { basename, dirname } from "path";
// import { Sequelize, DataTypes } from "sequelize";
// import { fileURLToPath } from 'url';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


// const db = {};


// export default (async () => {
// 	const files = readdirSync(__dirname)
// 		.filter(
// 			(file) => file.indexOf('.') !== 0
// 				&& file !== basename(__filename)
// 				&& file.slice(-3) === '.js',
// 		);

// 	files.forEach(async file => {
// 		const model = await import(`./${file}`);
// 		const namedModel = model.default(sequelize, DataTypes);
// 		db[namedModel.name] = namedModel;
// 	});

// 	Object.keys(db).forEach((modelName) => {
// 		if (db[modelName].associate) {
// 			db[modelName].associate(db);
// 		}
// 	});

// 	db.sequelize = sequelize;
// 	db.Sequelize = Sequelize;

// 	return db;
// })();