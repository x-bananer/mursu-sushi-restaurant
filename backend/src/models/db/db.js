import { pool } from './connection.js';

/**
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
export async function select(sql, params = []) {
  const [rows] = await pool.query(sql, params);

  if (!Array.isArray(rows)) {
    throw new Error('Expected SELECT query to return rows, but got non-row result.');
  }

  return /** @type {T[]} */ (rows);
}

/**
 * Execute an INSERT/UPDATE/DELETE query and return the result header
 * @param {string} sql
 * @param {any[]} params
 * @returns {Promise<ResultSetHeader>}
 */
export async function execute(sql, params = []) {
  const [result] = await pool.query(sql, params);

  if (Array.isArray(result)) {
    throw new Error('Expected mutation query to return ResultSetHeader, but got rows.');
  }

  return /** @type {ResultSetHeader} */ (result);
}
