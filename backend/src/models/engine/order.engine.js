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

export const OrderEngine = {
  STATUS,
  canTransition,
  validateTransition,
  getNextStatuses,
};
