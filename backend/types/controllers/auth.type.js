/**
 * POST /auth/register
 * Register a new user
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
 * Log in user and return tokens
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
 * Log out user by refresh token
 */

/**
 * @typedef {Object} LogoutRequest
 * @property {string} refresh_token
 */

/**
 * @typedef {Object} LogoutResponse
 * @property {boolean} success
 */
