/**
 * @typedef {Object} DishDTO
 * @property {number} id // from Dishes table
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {boolean} is_available
 * @property {Date} created_at
 * @property {Array<import('../common.type.js').Badge>} badges // built from DishBadges table with Badge objects from Badges table
 * @property {boolean} is_favorite // based on UserFavoriteDishes table
 */
