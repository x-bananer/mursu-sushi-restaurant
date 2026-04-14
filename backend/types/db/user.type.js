// ── User-related tables ───────────────────────────────────────────────

/**
 * @typedef {Object} Users
 * @property {number}      id
 * @property {string}      name
 * @property {string}      email
 * @property {string}      password_hash
 * @property {number}      role_id
 * @property {number}      stamp_count
 * @property {boolean}     stamp_discount_active
 * @property {string|null} refresh_token
 * @property {Date}        created_at
 */

/**
 * @typedef {Object} UserRewards
 * @property {number} id
 * @property {number} user_id
 * @property {string} reward_code
 * @property {number} points_awarded
 * @property {Date}   created_at
 */
