// ── Order-related tables ──────────────────────────────────────────────

/**
 * @typedef {Object} Orders
 * @property {number}      id
 * @property {number|null} user_id
 * @property {number}      status_id
 * @property {number}      delivery_type_id
 * @property {boolean}     is_paid
 * @property {string}      address
 * @property {number}      total_price
 * @property {Date}        created_at
 * @property {Date}        updated_at
 */

/**
 * @typedef {Object} OrderItems
 * @property {number}      id
 * @property {number}      order_id
 * @property {number|null} dish_id
 * @property {string}      name
 * @property {number}      quantity
 * @property {number}      price
 * @property {number}      item_type_id // 1 = regular dish, 2 = custom item
 */

/**
 * @typedef {Object} CustomOrderItemIngredients
 * @property {number} id
 * @property {number} order_item_id
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {number} id
 * @property {number} order_id
 * @property {number} status_id
 * @property {Date}   changed_at
 */

/**
 * @typedef {Object} Payments
 * @property {number} id
 * @property {number} order_id
 * @property {number} amount
 * @property {number} status_id
 * @property {string} provider
 * @property {string|null} provider_ref   ← MobilePay transaction reference
 * @property {Date}   created_at
 */
