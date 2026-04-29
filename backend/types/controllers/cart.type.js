/**
 * GET /cart
 * Get the current active cart by session id from `x-session-id` header.
 */

/**
 * @typedef {Object} GetCartRequest
 */

/**
 * @typedef {Object} GetCartResponse
 * @property {import('../dto/cart.type.js').CartDTO | null} cart
 */

/**
 * PATCH /cart
 * Update the current active cart by session id from `x-session-id` header.
 */

/**
 * @typedef {Object} UpdateCartRequest
 * @property {Array<UpdateCartItemData>} items
 */

/**
 * @typedef {Object} UpdateCartItemData
 * @property {number | null} [id] // from CartItems table, omitted for newly added items
 * @property {number | null} dish_id
 * @property {number} quantity
 * @property {number} item_type_id // 1 = dish, 2 = custom
 * @property {Array<UpdateCartIngredientData> | null} ingredients
 */

/**
 * @typedef {Object} UpdateCartIngredientData
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position
 */

/**
 * @typedef {Object} UpdateCartResponse
 * @property {import('../dto/cart.type.js').CartDTO} cart
 */

/**
 * POST /cart/checkout
 * Create order from current cart.
 */

/**
 * @typedef {Object} CheckoutCartRequest
 * @property {number} delivery_type_id
 * @property {string} address
 */

/**
 * @typedef {Object} CheckoutCartResponse
 * @property {import('../dto/order.type.js').OrderDTO} order
 */
