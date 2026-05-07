import { afterAll } from '@jest/globals';

afterAll(async () => {
	const { pool } = await import('../../src/models/db/connection.js');
	await pool.end();
});
