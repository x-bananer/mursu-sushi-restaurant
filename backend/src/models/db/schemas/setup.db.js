import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ADMIN pool
const dbAdmPool = mysql.createPool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_ADMIN_USER,
	password: process.env.DB_ADMIN_PASSWORD,
	multipleStatements: true,
});

// APP pool (mursu_user)
import { pool } from '../connection.js';

const adminFiles = ['01_mursu_user.sql'];

const appFiles = ['02_tables.sql', '03_lookup_tables.sql', '04_dummy_data.sql'];

function loadSQL(file) {
	return fs.readFileSync(path.join('src/models/db/schemas/', file), 'utf-8');
}

async function runFile(pool, file) {
	const sql = loadSQL(file);
	console.log(`Running ${file}...`);
	await pool.query(sql);
}

async function run() {
	try {
		console.log('--- PHASE 1: ADMIN SETUP ---');

		for (const file of adminFiles) {
			await runFile(dbAdmPool, file);
		}

		console.log('--- PHASE 2: APP SETUP ---');

		for (const file of appFiles) {
			await runFile(pool, file);
		}

		console.log('Database setup complete!');
	} catch (err) {
		console.error('Setup failed:', err.message);
		process.exitCode = 1;
	} finally {
		process.exit();
	}
}

run();
