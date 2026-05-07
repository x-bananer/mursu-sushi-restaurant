import { pool } from './connection.js';

/**
 * Select and execute wrappers allow pool for simple queries and conn for multi-step transaction
 *
 * @typedef {import('mysql2').RowDataPacket} RowDataPacket
 * @typedef {import('mysql2').ResultSetHeader} ResultSetHeader
 */

/**
 * Execute a SELECT query and return typed rows
 * @template {RowDataPacket} T
 * @param {string} sql
 * @param {any[]} params
 * @returns {Promise<T[]>}
 */
export async function select(sql, params = [], conn = null) {
	const executor = conn ?? pool;

	const [rows] = await executor.query(sql, params);

	if (!Array.isArray(rows)) {
		throw new Error('Expected SELECT query to return rows.');
	}

	return /** @type {T[]} */ (rows);
}

/**
 * Execute an INSERT/UPDATE/DELETE query and return the result header
 * @param {string} sql
 * @param {any[]} params
 * @returns {Promise<ResultSetHeader>}
 */
export async function execute(sql, params = [], conn = null) {
	const executor = conn ?? pool;

	const [result] = await executor.query(sql, params);

	if (Array.isArray(result)) {
		throw new Error('Expected ResultSetHeader but got rows.');
	}

	return /** @type {ResultSetHeader} */ (result);
}
