import dotenv from "dotenv"

dotenv.config()

const REJECT_UNAUTHORIZED = process.env.DATABASE_USE_SSL == "true"

export default {
	"development": {
		"username": process.env.DATABASE_USER,
		"password": process.env.DATABASE_PASSWORD,
		"database": process.env.DATABASE_NAME,
		"host": process.env.DATABASE_HOST,
		"dialect": "mysql",
		"dialectOptions": {
			"ssl": {
				"rejectUnauthorized": REJECT_UNAUTHORIZED,
			},
		}
	},
	"test": {
		"username": process.env.DATABASE_USER,
		"password": process.env.DATABASE_PASSWORD,
		"database": process.env.DATABASE_NAME,
		"host": process.env.DATABASE_HOST,
		"dialect": "mysql",
		"dialectOptions": {
			"ssl": {
				"rejectUnauthorized": REJECT_UNAUTHORIZED,
			},
		}
	},
	"production": {
		"username": process.env.DATABASE_USER,
		"password": process.env.DATABASE_PASSWORD,
		"database": process.env.DATABASE_NAME,
		"host": process.env.DATABASE_HOST,
		"dialect": "mysql",
		"dialectOptions": {
			"ssl": {
				"rejectUnauthorized": REJECT_UNAUTHORIZED,
			},
		}
	}
};