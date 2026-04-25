// ── Cart-related tables ──────────────────────────────────────────────

/**
 * Represents an active shopping cart belonging to a user or guest session.
 * One cart per user at a time — creating a new cart replaces the old one.
 *
 * @typedef {Object} Cart
 * @property {number}      id
 * @property {number|null} user_id       — null for guest carts (identified by session_id)
 * @property {string|null} session_id    — guest cart identifier, null for logged-in users
 * @property {Date}        created_at
 * @property {Date}        updated_at    — used to expire abandoned carts
 */

/**
 * A single line item inside a cart.
 * Mirrors the structure of order_items so that checkout is a direct conversion
 * from cart_items rows to order_items rows with no data transformation needed.
 *
 * @typedef {Object} CartItem
 * @property {number}      id
 * @property {number}      cart_id
 * @property {number|null} dish_id       — null for custom combo items
 * @property {number}      quantity
 * @property {number}      price         — unit price at time of adding to cart
 * @property {number}      item_type_id  — references order_item_types: 1=dish, 2=custom
 */

/**
 * Stores the ingredient composition of a custom combo cart item.
 * Only exists for CartItems where item_type_id = 2 (custom).
 * Mirrors order_item_ingredients so checkout conversion is direct.
 *
 * @typedef {Object} CartItemIngredient
 * @property {number} id
 * @property {number} cart_item_id
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position          — layer order in the combo builder
 */
