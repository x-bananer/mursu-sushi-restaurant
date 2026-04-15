/**
 * @typedef {Object} UserRole
 * @property {number} id
 * @property {'user' | 'admin'} type
 * @property {string} name // human-readable label, e.g. "Admin"
 */

/**
 * @typedef {Object} OrderStatus
 * @property {number} id
 * @property {'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'} type
 * @property {string} name // human-readable label of the type
 */

/**
 * @typedef {Object} DeliveryType
 * @property {number} id
 * @property {'pickup' | 'restaurant' | 'delivery'} type
 * @property {string} name // human-readable label of the type
 */

/**
 * @typedef {Object} OrderItemType
 * @property {number} id
 * @property {'dish' | 'custom'} type
 * @property {string} name // human-readable label of the type
 */

/**
 * @typedef {Object} PaymentStatus
 * @property {number} id
 * @property {'pending' | 'completed' | 'failed'} type
 * @property {string} name // human-readable label of the type
 */

/**
 * @typedef {Object} Badge
 * @property {number} id
 * @property {string} name
 */
