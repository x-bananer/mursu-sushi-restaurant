/** @typedef {import('./common.contract').OrderStatus} OrderStatus */
/** @typedef {import('./common.contract').DeliveryType} DeliveryType */
/** @typedef {import('./common.contract').OrderItemType} OrderItemType */
/** @typedef {import('./user.contract').UserResponse} UserResponse */

/**
 * @typedef {Object} Ingredient
 * @property {number} id
 * @property {string} name
 * @property {number} price
 */

/**
 * @typedef {Object} OrderItemIngredient
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position
 * @property {Ingredient} ingredient
 */

/**
 * @typedef {Object} OrderItemResponse
 * @property {number} id
 * @property {number|null} dish_id
 * @property {string} name
 * @property {number} quantity
 * @property {number} price
 * @property {OrderItemType} type
 * @property {Array<OrderItemIngredient>} ingredients
 */

/**
 * @typedef {Object} OrderResponse
 * @property {number} id
 * @property {UserResponse|null} user
 * @property {OrderStatus} status
 * @property {DeliveryType} delivery_type
 * @property {boolean} is_paid
 * @property {string} address
 * @property {number} total_price
 * @property {Array<OrderItemResponse>} items
 */

/**
 * @typedef {Object} OrderListResponse
 * @property {Array<OrderResponse>} orders
 */