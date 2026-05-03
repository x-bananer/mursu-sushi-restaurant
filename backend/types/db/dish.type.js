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
 * @typedef {Object} DishBadges
 * @property {number} dish_id
 * @property {number} badge_id
 */

/**
 * @typedef {Object} Ingredients
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {number} ingredient_type_id
 */

/**
 * @typedef {Object} IngredientType
 * @property {number} id
 * @property {string} type
 * @property {string} name
 */

/**
 * @typedef {Object} DailySpecials
 * @property {number} id
 * @property {number} dish_id
 * @property {string} valid_on        — 'YYYY-MM-DD'
 */

/**
 * @typedef {Object} UserFavoriteDishes
 * @property {number} user_id
 * @property {number} dish_id
 */
