/**
 * GET /cart
 * Get the current active cart for the user or guest session.
 * Cart identity is resolved by server from access token (user) or session_id (guest).
 */

/**
 * @typedef {Object} GetCartRequest
 * @property {string} [session_id] // optional guest session id when user is not authenticated
 */

/**
 * @typedef {Object} GetCartResponse
 * @property {import('../dto/cart.type.js').CartDTO | null} cart
 */

/**
 * POST /cart
 * Create a new active cart for the current user or guest session.
 */

/**
 * @typedef {Object} CreateCartRequest
 * @property {string} [session_id] // optional guest session id when user is not authenticated
 * @property {Array<CreateCartItemData>} items
 */

/**
 * @typedef {Object} CreateCartItemData
 * @property {number | null} dish_id
 * @property {number} quantity
 * @property {number} item_type_id // 1 = dish, 2 = custom
 * @property {Array<CreateCartIngredientData> | null} ingredients
 */


/**
 * @typedef {Object} CreateCartIngredientData
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position
 */

/**
 * @typedef {Object} CreateCartResponse
 * @property {import('../dto/cart.type.js').CartDTO} cart
 */
 
/**
 * PATCH /cart
 * Update the current active cart for the current user or guest session.
 */

/**
 * @typedef {Object} UpdateCartRequest
 * @property {string} [session_id] // optional guest session id when user is not authenticated
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
