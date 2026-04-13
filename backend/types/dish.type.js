/**
 * @typedef {Object} Badge
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} DishResponse
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {Array<Badge>} badges
 * @property {boolean} isFavorite
 */

/**
 * @typedef {Object} DishListResponse
 * @property {Array<DishResponse>} dishes
 */

/**
 * @typedef {Object} ToggleFavoriteRequest
 * @property {number} dish_id
 */