import { select, execute } from "../../db.js";
/* use select and execute wrappers. Pass queries to them. See models from Luaras order report. */

/**
 * @typedef {import("../../../../../types/db/user.type.js").Users} Users
 */

/**
 * Find a user by email.
 * @param {string} email
 * @returns {Promise<Users | null>}
 */
export async function getUserByEmail(email) {
	const rows = await select(
		`
			SELECT *
			FROM users
			WHERE email = ?
			LIMIT 1
		`,
		[email],
	);

	if (rows.length === 0) {
		return null;
	}

	return /** @type {Users} */ (rows[0]);
}

/**
 * Create a new user account.
 * @param {{ name: string, email: string, passwordHash: string, roleId?: number }} data
 * @returns {Promise<number>} inserted user id
 */
export async function createUser(data) {
	const roleId = data.roleId || 1;

	const result = await execute(
		`
			INSERT INTO users (name, email, password_hash, role_id, stamp_count, is_stamp_discount_active)
			VALUES (?, ?, ?, ?, 0, 0)
		`,
		[data.name, data.email, data.passwordHash, roleId],
	);

	if (result && typeof result.insertId === "number") {
		return result.insertId;
	}

	return 0;
}

/**
 * Returns the full user row by id.
 * @param {number} userId
 * @returns {Promise<Users | null>}
 */
export async function getUserById(userId) {
	const rows = await select(
		`
			SELECT *
			FROM users
			WHERE id = ?
			LIMIT 1
		`,
		[userId],
	);

	if (rows.length === 0) {
		return null;
	}

	return /** @type {Users} */ (rows[0]);
}

/**
 * Checks whether a user exists by id.
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
export async function userExistsById(userId) {
	const rows = await select(
		`
			SELECT 1
			FROM users
			WHERE id = ?
			LIMIT 1
		`,
		[userId],
	);

	if (rows.length === 0) {
		return false;
	}

	return true;
}

/**
 * Returns user fields needed for checkout discount logic.
 * @param {number} userId
 * @returns {Promise<Pick<Users, "id" | "stamp_count" | "is_stamp_discount_active"> | null>}
 */
export async function getUserDiscountStateById(userId) {
	const rows = await select(
		`
			SELECT id, stamp_count, is_stamp_discount_active
			FROM users
			WHERE id = ?
			LIMIT 1
		`,
		[userId],
	);

	if (rows.length === 0) {
		return null;
	}

	return /** @type {Pick<Users, "id" | "stamp_count" | "is_stamp_discount_active">} */ (rows[0]);
}

/**
 * Checks if a specific order belongs to a user.
 * @param {number} userId
 * @param {number} orderId
 * @returns {Promise<boolean>}
 */
export async function userOwnsOrder(userId, orderId) {
	const rows = await select(
		`
			SELECT 1
			FROM orders
			WHERE id = ?
				AND user_id = ?
			LIMIT 1
		`,
		[orderId, userId],
	);

	if (rows.length === 0) {
		return false;
	}

	return true;
}

/**
 * Sets stamp_count to the provided value.
 * @param {number} userId
 * @param {number} stampCount
 * @returns {Promise<void>}
 */
export async function updateStampCount(userId, stampCount) {
	await execute(
		`
			UPDATE users
			SET stamp_count = ?
			WHERE id = ?
		`,
		[stampCount, userId],
	);
}

/**
 * Increments stamp_count after a successful order.
 * @param {number} userId
 * @param {number} incrementBy
 * @returns {Promise<void>}
 */
export async function incrementStampCount(userId, incrementBy = 1) {
	await execute(
		`
			UPDATE users
			SET stamp_count = stamp_count + ?
			WHERE id = ?
		`,
		[incrementBy, userId],
	);
}

/**
 * Toggles the stamp-discount active flag.
 * @param {number} userId
 * @param {boolean} isActive
 * @returns {Promise<void>}
 */
export async function updateIsStampDiscountActive(userId, isActive) {
	await execute(
		`
			UPDATE users
			SET is_stamp_discount_active = ?
			WHERE id = ?
		`,
		[isActive, userId],
	);
}
