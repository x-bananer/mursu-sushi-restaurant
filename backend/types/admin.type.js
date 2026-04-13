/** @typedef {import('./common.contract').OrderStatus} OrderStatus */
/** @typedef {import('./common.contract').DeliveryType} DeliveryType */
/** @typedef {import('./common.contract').OrderItemType} OrderItemType */
/** @typedef {import('./common.contract').UserRole} UserRole */
/** @typedef {import('./user.contract').UserResponse} UserResponse */

/**
 * DISHES
 */

/**
 * @typedef {Object} CreateDishRequest
 * @property {string} name
 * @property {number} price
 * @property {Array<number>} badge_ids
 */

/**
 * @typedef {Object} UpdateDishRequest
 * @property {string} name
 * @property {number} price
 * @property {Array<number>} badge_ids
 */

/**
 * INGREDIENTS
 */

/**
 * @typedef {Object} CreateIngredientRequest
 * @property {string} name
 * @property {number} price
 */

/**
 * @typedef {Object} UpdateIngredientRequest
 * @property {string} name
 * @property {number} price
 */

/**
 * ORDERS
 */

/**
 * @typedef {Object} UpdateOrderStatusRequest
 * @property {number} status_id
 */

/**
 * USERS
 */

/**
 * @typedef {Object} UpdateUserRoleRequest
 * @property {number} role_id
 */