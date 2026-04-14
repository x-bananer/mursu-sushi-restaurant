/**
 * POST /auth/register
 * Content-Type: multipart/form-data
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {File | null} avatar
 */

/**
 * @typedef {Object} RegisterResponse
 * @property {import('../dto/user.type.js').UserDTO} user
 * @property {string} access_token
 * @property {string} refresh_token
 */

/**
 * POST /auth/login
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginResponse
 * @property {import('../dto/user.type.js').UserDTO} user
 * @property {string} access_token
 * @property {string} refresh_token
 */

/**
 * POST /auth/logout
 */

/**
 * @typedef {Object} LogoutRequest
 * @property {string} refresh_token
 */

/**
 * @typedef {Object} LogoutResponse
 * @property {boolean} success
 */
