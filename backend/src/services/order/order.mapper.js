/**
 * @typedef {import('../../../types/dto/order.type.js').OrderDTO} OrderDTO
 * @typedef {import('../../../types/dto/order.type.js').DishOrderItemDTO} DishOrderItemDTO
 * @typedef {import('../../../types/dto/order.type.js').CustomOrderItemDTO} CustomOrderItemDTO
 * @typedef {import('../../../types/dto/order.type.js').CustomOrderIngredientDTO} CustomOrderIngredientDTO
 */

const statusMap = {
  1: { id: 1, type: 'pending', name: 'Pending' },
  2: { id: 2, type: 'confirmed', name: 'Confirmed' },
  3: { id: 3, type: 'preparing', name: 'Preparing' },
  4: { id: 4, type: 'ready', name: 'Ready' },
  5: { id: 5, type: 'delivered', name: 'Delivered' },
  6: { id: 6, type: 'cancelled', name: 'Cancelled' },
};

const deliveryTypeMap = {
  1: { id: 1, type: 'pickup', name: 'Pickup' },
  2: { id: 2, type: 'restaurant', name: 'Restaurant' },
  3: { id: 3, type: 'delivery', name: 'Delivery' },
};

const itemTypeMap = {
  1: { id: 1, type: 'dish', name: 'Dish' },
  2: { id: 2, type: 'custom', name: 'Custom' },
};

/**
 * @param {import('../../../types/db/order.type.js').Orders} order
 * @param {import('../../../types/db/order.type.js').OrderItems[]} items
 * @param {import('../../../types/db/order.type.js').CustomOrderItemIngredients[]} ingredients
 * @returns {OrderDTO}
 */
export function toOrderDTO(order, items, ingredients) {
  if (!order) throw new Error('Order is required');
  if (!Array.isArray(items)) throw new Error('Items must be an array');
  if (!Array.isArray(ingredients)) throw new Error('Ingredients must be an array');

  const status = statusMap[order.status_id];
  const deliveryType = deliveryTypeMap[order.delivery_type_id];

  if (!status) {
    throw new Error(`Invalid status_id: ${order.status_id}`);
  }

  if (!deliveryType) {
    throw new Error(`Invalid delivery_type_id: ${order.delivery_type_id}`);
  }

  /** @type {Record<number, CustomOrderIngredientDTO[]>} */
  const ingredientMap = {};

  for (const ing of ingredients) {
    if (!ingredientMap[ing.order_item_id]) {
      ingredientMap[ing.order_item_id] = [];
    }

    ingredientMap[ing.order_item_id].push({
      id: ing.id,
      ingredient: {
        id: ing.ingredient_id,
        name: '', // TODO: enrich from ingredient repo
        price: 0, // TODO: enrich from ingredient repo
      },
      quantity: ing.quantity,
      position: ing.position,
    });
  }

  /** @type {OrderDTO} */
  const dto = {
    id: order.id,

    user: null, // TODO: enrich from user repo

    status,
    delivery_type: deliveryType,

    is_paid: Boolean(order.is_paid),
    address: order.address,
    total_price: order.total_price,
    created_at: order.created_at,
    updated_at: order.updated_at,

    order_items: items.map((item) => {
      const type = itemTypeMap[item.item_type_id] || {
        id: item.item_type_id,
        type: 'unknown',
        name: 'Unknown',
      };

      const base = {
        id: item.id,
        order_id: item.order_id,
        quantity: item.quantity,
        price: item.price,
        type,
      };

      if (item.item_type_id === 2) {
        /** @type {CustomOrderItemDTO} */
        return {
          ...base,
          dish: null,
          ingredients: ingredientMap[item.id] || [],
        };
      }

      /** @type {DishOrderItemDTO} */
      return {
        ...base,
        dish: {
          id: item.dish_id,
          name: item.name || '',
          description: '', // TODO: enrich from dish repo
          price: item.price,
          is_available: true,
          created_at: new Date(),
          badges: [],
          is_favorite: false,
        },
        ingredients: null,
      };
    }),

    payment: null, // TODO: enrich from payment repo
  };

  return dto;
}
