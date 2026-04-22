/**
 * @typedef {import('../../../types/dto/cart.type.js').CartDTO} CartDTO
 */

// Make cart DTO (data transfer object) - this is the cart shape that will be sent to the frontend
export const toCartDTO = (cart, items, ingredients) => {
  if (!cart) {
    throw new Error('Cart is required');
  }

  const ingredientMap = {};

  for (const ingredient of ingredients) {
    if (!ingredientMap[ingredient.cart_item_id]) {
      ingredientMap[ingredient.cart_item_id] = [];
    }

    ingredientMap[ingredient.cart_item_id].push({
      id: ingredient.id,
      ingredient: {
        id: ingredient.ingredient_id,
        name: ingredient.ingredient_name || '',
        price: Number(ingredient.ingredient_price ?? 0),
      },
      quantity: ingredient.quantity,
      position: ingredient.position,
    });
  }

  const mappedItems = [];

  for (const item of items) {
    let type = {
      id: 1,
      type: 'dish',
      name: 'Menu Dish',
    };

    if (item.item_type_id === 2) {
      type = {
        id: 2,
        type: 'custom',
        name: 'Custom Combo',
      };
    }

    if (item.item_type_id === 2) {
      mappedItems.push({
        id: item.id,
        cart_id: item.cart_id,
        quantity: item.quantity,
        price: Number(item.price),
        type,
        dish: null,
        ingredients: ingredientMap[item.id] || [],
      });
    } else {
      mappedItems.push({
        id: item.id,
        cart_id: item.cart_id,
        quantity: item.quantity,
        price: Number(item.price),
        type,
        dish: {
          id: item.dish_id,
          name: item.dish_name || '',
          description: item.dish_description || '',
          price: Number(item.dish_price ?? item.price ?? 0),
          is_available: Boolean(item.dish_is_available),
          created_at: item.dish_created_at || null,
          badges: [],
          is_favorite: false,
        },
        ingredients: null,
      });
    }
  }

  let totalPrice = 0;

  for (const item of mappedItems) {
    totalPrice = totalPrice + Number(item.price) * Number(item.quantity);
  }

  return {
    id: cart.id,
    user_id: cart.user_id,
    session_id: cart.session_id,
    total_price: Number(totalPrice.toFixed(2)),
    created_at: cart.created_at,
    updated_at: cart.updated_at,
    items: mappedItems,
  };
}
