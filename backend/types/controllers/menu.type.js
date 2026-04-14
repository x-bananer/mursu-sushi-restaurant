/**
 * GET /menu
 * Get menu dishes list
 */

/**
 * @typedef {Object} MenuRequest
 */

/**
 * @typedef {Object} MenuResponse
 * @property {Array<import('../dto/dish.type.js').DishDTO>} dishes
 */

/**
 * GET /menu/daily-special
 * Get current daily special dish
 */

/**
 * @typedef {Object} DailySpecialRequest
 */

/**
 * @typedef {Object} DailySpecialResponse
 * @property {import('../dto/dish.type.js').DishDTO | null} dish
 */
