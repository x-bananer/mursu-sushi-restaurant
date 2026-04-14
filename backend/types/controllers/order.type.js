/**
 * POST /orders
 * Create a new order from ready cart data
 */

/**
 * @typedef {Object} CreateOrderRequest
 * @property {number} delivery_type_id
 * @property {string} address
 * @property {Array<OrderItemData>} items
 */

/**
 * @typedef {Object} OrderItemData
 * @property {number | null} dish_id
 * @property {number} quantity
 * @property {Array<OrderIngredientData> | null} ingredients
 */

/**
 * @typedef {Object} OrderIngredientData
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position
 */

/**
 * @typedef {Object} CreateOrderResponse
 * @property {import('../dto/order.type.js').OrderDTO} order
 */

/**
 * GET /orders/:id
 * Get one order by id
 */

/**
 * @typedef {Object} OrderRequest
 * @property {number} id
 */

/**
 * @typedef {Object} OrderResponse
 * @property {import('../dto/order.type.js').OrderDTO} order
 */
