// ── Dish-related tables ───────────────────────────────────────────────

/**
 * @typedef {Object} Dishes
 * @property {number}  id
 * @property {string}  name
 * @property {string}  description
 * @property {number}  price
 * @property {boolean} is_available
 * @property {Date}    created_at
 */

/**
 * @typedef {Object} Badges
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} DishBadges
 * @property {number} dish_id
 * @property {number} badge_id
 */

/**
 * @typedef {Object} Ingredients
 * @property {number} id
 * @property {string} name
 * @property {number} price
 */

/**
 * @typedef {Object} DailySpecials
 * @property {number} id
 * @property {number} dish_id
 * @property {string} date        — 'YYYY-MM-DD'
 */

/**
 * @typedef {Object} UserFavoriteDishes
 * @property {number} user_id
 * @property {number} dish_id
 */




