/**
 * GET /users/:id
 * Get one user by id
 */

/**
 * @typedef {Object} UserRequest
 * @property {number} id
 */

/**
 * @typedef {Object} UserResponse
 * @property {import('../dto/user.type.js').UserDTO} user
 */

/**
 * PATCH /users/:id
 * Update user fields
 * Content-Type: multipart/form-data
 */

/**
 * @typedef {Object} UpdateUserRequest
 * @property {number} id
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [password]
 * @property {File | null} [file]
 */

/**
 * @typedef {Object} UpdateUserResponse
 * @property {import('../dto/user.type.js').UserDTO} user
 */
