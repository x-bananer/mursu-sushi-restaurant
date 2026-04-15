/**
 * GET /users/me
 * Get current user by token
 */

/**
 * @typedef {Object} MeRequest
 */

/**
 * @typedef {Object} MeResponse
 * @property {import('../dto/user.type.js').UserDTO} user
 */

/**
 * PATCH /users/me
 * Update current user
 * Content-Type: multipart/form-data
 */

/**
 * @typedef {Object} UpdateMeRequest
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [password]
 * @property {File | null} [photo]
 */

/**
 * @typedef {Object} UpdateMeResponse
 * @property {import('../dto/user.type.js').UserDTO} user
 */
