import dotenv, { config } from "dotenv"

dotenv.config()

const REJECT_UNAUTHORIZED = process.env.DATABASE_USE_SSL == "true"

const dbConfig = {
	"development": {
		"username": process.env.DATABASE_USER,
		"password": process.env.DATABASE_PASSWORD,
		"database": process.env.DATABASE_NAME,
		"host": process.env.DATABASE_HOST,
		"port": process.env.DATABASE_PORT,
		"dialect": process.env.DATABASE_TYPE
	},
	"test": {
		"username": process.env.DATABASE_USER,
		"password": process.env.DATABASE_PASSWORD,
		"database": process.env.DATABASE_NAME,
		"host": process.env.DATABASE_HOST,
		"port": process.env.DATABASE_PORT,
		"dialect": process.env.DATABASE_TYPE
	},
	"production": {
		"username": process.env.DATABASE_USER,
		"password": process.env.DATABASE_PASSWORD,
		"database": process.env.DATABASE_NAME,
		"host": process.env.DATABASE_HOST,
		"port": process.env.DATABASE_PORT,
		"dialect": process.env.DATABASE_TYPE
	}
};

let ssl_options = {
	"ssl": {
		"rejectUnauthorized": REJECT_UNAUTHORIZED,
	},
}

if (REJECT_UNAUTHORIZED) {
	dbConfig.development.dialectOptions = ssl_options
	dbConfig.test.dialectOptions = ssl_options
	dbConfig.production.dialectOptions = ssl_options
}


console.log(dbConfig)

export default dbConfig;