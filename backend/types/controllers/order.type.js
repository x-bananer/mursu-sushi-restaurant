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
 * GET /orders
 * Get current user's orders list
 */

/**
 * @typedef {Object} OrdersRequest
 */

/**
 * @typedef {Object} OrdersResponse
 * @property {Array<import('../dto/order.type.js').OrderDTO>} orders
 */

/**
 * GET /orders/:id
 * Get one order by order id
 */

/**
 * @typedef {Object} OrderRequest
 * @property {number} id
 */

/**
 * @typedef {Object} OrderResponse
 * @property {import('../dto/order.type.js').OrderDTO} order
 */

/**
 * DELETE /orders/:id
 * Delete one order by id
 */

/**
 * @typedef {Object} DeleteOrderRequest
 * @property {number} id
 */

/**
 * @typedef {Object} DeleteOrderResponse
 * @property {boolean} success
 */

/**
 * GET /orders/:id/tracking
 * Get order tracking data by id
 */

/**
 * @typedef {Object} OrderTrackingRequest
 * @property {number} id
 */

/**
 * @typedef {Object} OrderTrackingResponse
 * @property {import('../dto/order.type.js').OrderDTO} order
 * @property {Array<import('../dto/order.type.js').OrderStatusHistoryDTO>} history
 */
