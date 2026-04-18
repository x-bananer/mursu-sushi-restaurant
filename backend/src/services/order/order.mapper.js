/**
 * @typedef {import('../../../types/dto/order.type.js').OrderDTO} OrderDTO
 * @typedef {import('../../../types/dto/order.type.js').DishOrderItemDTO} DishOrderItemDTO
 * @typedef {import('../../../types/dto/order.type.js').CustomOrderItemDTO} CustomOrderItemDTO
 * @typedef {import('../../../types/dto/order.type.js').CustomOrderIngredientDTO} CustomOrderIngredientDTO
 */

/**
 * Group ingredients by order_item_id
 * @param {any[]} ingredients
 * @returns {Record<number, CustomOrderIngredientDTO[]>}
 */
function groupIngredientsByItemId(ingredients) {
  /** @type {Record<number, CustomOrderIngredientDTO[]>} */
  const map = {};

  for (const ing of ingredients) {
    if (!map[ing.order_item_id]) {
      map[ing.order_item_id] = [];
    }

    map[ing.order_item_id].push({
      id: ing.id,
      ingredient: {
        id: ing.ingredient_id,
        name: ing.ingredient_name || '',
        price: ing.ingredient_price || 0,
      },
      quantity: ing.quantity,
      position: ing.position,
    });
  }

  return map;
}

/**
 * Map single order item
 */
function mapOrderItem(item, ingredientMap) {
  const base = {
    id: item.id,
    order_id: item.order_id,
    quantity: item.quantity,
    price: item.price,
    type: {
      id: item.item_type_id,
      type: item.item_type_type,
      name: item.item_type_name,
    },
  };

  // CUSTOM ITEM
  if (item.item_type_type === 'custom') {
    /** @type {CustomOrderItemDTO} */
    return {
      ...base,
      ingredients: ingredientMap[item.id] || [],
    };
  }

  // DISH ITEM
  /** @type {DishOrderItemDTO} */
  return {
    ...base,
    dish: {
      id: item.dish_id,
      name: item.dish_name,
      price: item.dish_price,
    }
  };
}

/**
 * MAIN MAPPER
 */
export function toOrderDTO(order, items, ingredients) {
  if (!order) throw new Error('Order is required');

  const ingredientMap = groupIngredientsByItemId(ingredients);

  return {
    id: order.id,

    user: null, // TODO: user repo

    status: {
      id: order.status_id,
      type: order.status_type,
      name: order.status_name,
    },

    delivery_type: {
      id: order.delivery_type_id,
      type: order.delivery_type_type,
      name: order.delivery_type_name,
    },

    is_paid: Boolean(order.is_paid),
    address: order.address,
    total_price: order.total_price,
    created_at: order.created_at,
    updated_at: order.updated_at,

    order_items: items.map(item =>
      mapOrderItem(item, ingredientMap)
    ),

    payment: null, // TODO: payment repo
  };
}

/**
 * Handle multiple orders
 * @param {import('../../../types/db/order.type.js').Orders[]} orders
 * @param {import('../../../types/db/order.type.js').OrderItems[]} items
 * @param {import('../../../types/db/order.type.js').CustomOrderItemIngredients[]} ingredients
 * @returns {OrderDTO[]}
 */
export function toOrderListDTO(orders, items, ingredients) {
  const itemsByOrderId = {};

  for (const item of items) {
    if (!itemsByOrderId[item.order_id]) {
      itemsByOrderId[item.order_id] = [];
    }
    itemsByOrderId[item.order_id].push(item);
  }

  return orders.map(order => {
    const orderItems = itemsByOrderId[order.id] || [];

    return toOrderDTO(order, orderItems, ingredients);
  });
}

//Update to return full DTO instead of just patial. Let front end decide on what will take.
