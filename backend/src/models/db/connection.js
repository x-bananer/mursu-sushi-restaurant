import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_FILE_PATH = path.resolve(__dirname, "../../../.env");

dotenv.config({ path: ENV_FILE_PATH, override: true });

function getRequiredEnv(name) {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

function getDatabaseUser() {
	if (process.env.SUSHI_RESTAURANT_DB_USER) {
		return process.env.SUSHI_RESTAURANT_DB_USER;
	}

	return getRequiredEnv("DB_USER");
}

function getDatabasePassword() {
	if (process.env.SUSHI_RESTAURANT_DB_PASSWORD) {
		return process.env.SUSHI_RESTAURANT_DB_PASSWORD;
	}

	return getRequiredEnv("DB_PASSWORD");
}

/**
 * Simple standalone queries
 */
export const pool = mysql.createPool({
	host: getRequiredEnv("DB_HOST"),
	port: Number(process.env.DB_PORT || 3306),
	user: getDatabaseUser(),
	password: getDatabasePassword(),
	database: getRequiredEnv("DB_NAME"),
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	multipleStatements: true,
});

/**
 * Transaction wrapper for multi-step logic
 */
export async function withTransaction(callback) {
	const conn = await pool.getConnection();

	try {
		await conn.beginTransaction();

		const result = await callback(conn);

		await conn.commit();
		return result;
	} catch (err) {
		await conn.rollback();
		throw err;
	} finally {
		conn.release();
	}
}
