/**
 * OrderEngine
 * Pure business logic for order state transitions
 * - No DB access
 * - No HTTP logic
 * - Uses lookup table "type" values (not IDs)
 */

const STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

/**
 * Allowed transitions between statuses
 */
const TRANSITIONS = {
  [STATUS.PENDING]:   [STATUS.CONFIRMED, STATUS.CANCELLED],
  [STATUS.CONFIRMED]: [STATUS.PREPARING, STATUS.CANCELLED],
  [STATUS.PREPARING]: [STATUS.READY],
  [STATUS.READY]:     [STATUS.DELIVERED],
  [STATUS.DELIVERED]: [],
  [STATUS.CANCELLED]: [],
};

/**
 * Check transition validity
 */
function canTransition(currentStatus, nextStatus) {
  return TRANSITIONS[currentStatus]?.includes(nextStatus) || false;
}

/**
 * Validate transition rules
 */
function validateTransition(order, nextStatus) {
  const errors = [];

  const currentStatus = order.status;

  if (!canTransition(currentStatus, nextStatus)) {
    errors.push(`Invalid transition: ${currentStatus} → ${nextStatus}`);
  }

  if (nextStatus === STATUS.CONFIRMED && !order.is_paid) {
    errors.push('Order must be paid before confirmation');
  }

  if (
    currentStatus === STATUS.DELIVERED ||
    currentStatus === STATUS.CANCELLED
  ) {
    errors.push(`Cannot modify order in final state: ${currentStatus}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get allowed next statuses
 */
function getNextStatuses(currentStatus) {
  return TRANSITIONS[currentStatus] || [];
}

function validateCreateOrder(data) {
  if (!data) {
    throw new Error('Order payload is required');
  }

  if (!Array.isArray(data.order_items) || data.order_items.length === 0) {
    throw new Error('order_items must be a non-empty array');
  }

  for (const item of data.order_items) {
    if (!item.item_type_id) {
      throw new Error('item_type_id is required for each order item');
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error('quantity must be a positive number');
    }

    if (typeof item.price !== 'number' || item.price < 0) {
      throw new Error('price must be a valid number');
    }

    // DISH item
    if (item.item_type_id === 1 && !item.dish_id) {
      throw new Error('dish_id is required for dish items');
    }

    // CUSTOM item
    if (item.item_type_id === 2) {
      if (!Array.isArray(item.ingredients)) {
        throw new Error('ingredients must be an array for custom items');
      }

      for (const ing of item.ingredients) {
        if (!ing.ingredient_id) {
          throw new Error('ingredient_id is required');
        }

        if (typeof ing.quantity !== 'number' || ing.quantity <= 0) {
          throw new Error('ingredient quantity must be > 0');
        }
      }
    }
  }
}

export const OrderEngine = {
  STATUS,
  canTransition,
  validateTransition,
  getNextStatuses,
  validateCreateOrder
};
