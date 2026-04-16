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
