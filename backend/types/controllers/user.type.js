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
 * @property {File | null} [photo]
 */

/**
 * @typedef {Object} UpdateUserResponse
 * @property {import('../dto/user.type.js').UserDTO} user
 */

/**
 * POST /users/favorites/:dish_id
 * Add dish to user favorites
 */

/**
 * @typedef {Object} AddFavoriteDishRequest
 * @property {number} dish_id
 */

/**
 * @typedef {Object} AddFavoriteDishResponse
 * @property {boolean} success
 */

/**
 * DELETE /users/favorites/:dish_id
 * Remove dish from user favorites
 */

/**
 * @typedef {Object} RemoveFavoriteDishRequest
 * @property {number} dish_id
 */

/**
 * @typedef {Object} RemoveFavoriteDishResponse
 * @property {boolean} success
 */
