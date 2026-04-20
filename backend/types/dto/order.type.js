/**
 * OrderDTO is a full order.
 * It contains order items. Each item is either a dish item or a custom item.
 * Custom items contain ingredients.
 */

/**
 * @typedef {Object} OrderDTO
 * @property {number} id // from Orders table
 * @property {import('./user.type.js').UserDTO | null} user
 * @property {import('../db/common.type.js').OrderStatus} status
 * @property {import('../db/common.type.js').DeliveryType} delivery_type
 * @property {boolean} is_paid
 * @property {string} address
 * @property {number} total_price
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {Array<DishOrderItemDTO | CustomOrderItemDTO>} order_items // from OrderItems table
 * @property {OrderPaymentDTO | null} payment
 */

/**
 * @typedef {Object} DishOrderItemDTO
 * @property {number} id // from OrderItems table
 * @property {number} order_id
 * @property {import('./dish.type.js').DishDTO} dish
 * @property {number} quantity
 * @property {number} price
 * @property {import('../db/common.type.js').OrderItemType} type
 * @property {null} ingredients
 */

/**
 * @typedef {Object} CustomOrderItemDTO
 * @property {number} id // from OrderItems table
 * @property {number} order_id
 * @property {null} dish
 * @property {number} quantity
 * @property {number} price
 * @property {import('../db/common.type.js').OrderItemType} type
 * @property {Array<CustomOrderIngredientDTO>} ingredients
 */

/**
 * @typedef {Object} CustomOrderIngredientDTO
 * @property {number} id // from CustomOrderItemIngredients table
 * @property {import('./dish.type.js').IngredientDTO} ingredient
 * @property {number} quantity
 * @property {number} position
 */

/**
 * @typedef {Object} OrderStatusHistoryDTO
 * @property {number} id // from OrderStatusHistory table
 * @property {number} order_id
 * @property {import('../db/common.type.js').OrderStatus} status
 * @property {Date} changed_at
 */

/**
 * @typedef {Object} OrderPaymentDTO
 * @property {number} id // from Payments table
 * @property {number} order_id
 * @property {number} amount
 * @property {import('../db/common.type.js').PaymentStatus} status
 * @property {string} provider
 * @property {string | null} provider_ref
 * @property {Date} created_at
 */
