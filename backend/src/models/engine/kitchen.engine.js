/**
 * KitchenEngine - predictive ETA model
 * --------------------------------------------------
 * Purpose:
 * Estimate when an order will be ready based on:
 * 1. Item complexity
 * 2. Order size
 * 3. Kitchen load (statistical, not simulated)
 *
 * IMPORTANT:
 * - No DB access
 * - No order list processing
 * - No queue simulation
 * - Pure mathematical model
 */

/**
 * --------------------------------------------------
 * CONFIGURATION
 * Tuned for sushi-style kitchen throughput
 * --------------------------------------------------
 */
const PREP_CONFIG = {
  dish: {
    base: 5,
    perExtraQty: 1
  },
  custom: {
    base: 8,
    perIngredient: 1.5,
    max: 18
  },
  fallback: 6
};

/**
 * --------------------------------------------------
 * ITEM PREP TIME
 * --------------------------------------------------
 */
function getItemPrepTime(item) {
  if (item.item_type_id === 1) {
    const extraQty = Math.max(0, item.quantity - 1);
    return PREP_CONFIG.dish.base + extraQty * PREP_CONFIG.dish.perExtraQty;
  }

  if (item.item_type_id === 2) {
    const ingredientCount = item.ingredients?.length || 0;

    const time =
      PREP_CONFIG.custom.base +
      ingredientCount * PREP_CONFIG.custom.perIngredient;

    return Math.min(time, PREP_CONFIG.custom.max);
  }

  return PREP_CONFIG.fallback;
}

/**
 * --------------------------------------------------
 * ORDER PREP TIME (BASE KITCHEN WORK)
 * --------------------------------------------------
 * Assumption:
 * Kitchen works in parallel - slowest item dominates
 */
function estimateOrderPrepTime(order) {
  const items = order.order_items;
  console.log('kitchen engine order: ' + JSON.stringify(order, null, 2));
  console.log('kitchen engine items: ' + JSON.stringify(items, null, 2));
  if (!items.length) throw new Error('item quantity must be > 0');;

  const maxItemTime = Math.max(...items.map(getItemPrepTime));

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const complexityBonus = Math.floor(totalQuantity / 4);

  return Math.round(maxItemTime + complexityBonus);
}

/**
 * --------------------------------------------------
 * QUEUE DELAY ESTIMATION (PREDICTIVE ONLY)
 * --------------------------------------------------
 * IMPORTANT:
 * No order arrays, no simulation
 *
 * Input:
 * - number of orders ahead
 * - estimated average kitchen throughput
 */
function estimateQueueDelay(context = {}) {
  const {
    activeOrdersAheadCount = 0,
    avgOrderPrepTime = 10
  } = context;

  if (activeOrdersAheadCount === 0) return 0;

  const throughputFactor = 0.6;

  return Math.round(
    activeOrdersAheadCount * avgOrderPrepTime * throughputFactor
  );
}

/**
 * --------------------------------------------------
 * FINAL READY TIME ESTIMATION
 * --------------------------------------------------
 */
function estimateReadyTime(order, context = {}) {
  const prepTime = estimateOrderPrepTime(order);
  const queueDelay = estimateQueueDelay(context);

  const totalMinutes = prepTime + queueDelay;

  const queuePosition = (context.activeOrdersAheadCount || 0) + 1;

  return {
    prepTime,
    queueDelay,
    totalTime: totalMinutes,
    queuePosition,
    readyAt: new Date(Date.now() + totalMinutes * 60000)
  };
}

export const KitchenEngine = {
  getItemPrepTime,
  estimateOrderPrepTime,
  estimateQueueDelay,
  estimateReadyTime
};
