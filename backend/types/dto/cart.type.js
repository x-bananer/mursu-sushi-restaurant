/**
 * @typedef {Object} CartDTO
 * @property {number} id // from Carts table
 * @property {import('./user.type.js').UserDTO | null} user
 * @property {string | null} session_id
 * @property {number} total_price
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {Array<DishCartItemDTO | CustomCartItemDTO>} items
 */

/**
 * @typedef {Object} DishCartItemDTO
 * @property {number} id // from CartItems table
 * @property {number} cart_id
 * @property {import('./dish.type.js').DishDTO} dish
 * @property {number} quantity
 * @property {number} price
 * @property {import('../common.type.js').OrderItemType} type
 * @property {null} ingredients
 */

/**
 * @typedef {Object} CustomCartItemDTO
 * @property {number} id // from CartItems table
 * @property {number} cart_id
 * @property {null} dish
 * @property {number} quantity
 * @property {number} price
 * @property {import('../common.type.js').OrderItemType} type
 * @property {Array<CustomCartIngredientDTO>} ingredients
 */

/**
 * @typedef {Object} CustomCartIngredientDTO
 * @property {number} id // from CartItemIngredients table
 * @property {import('./dish.type.js').IngredientDTO} ingredient
 * @property {number} quantity
 * @property {number} position
 */
