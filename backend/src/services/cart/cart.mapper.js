/**
 * @typedef {import('../../../types/dto/cart.type.js').CartDTO} CartDTO
 */

// Make cart DTO (data transfer object) - this is the cart shape that will be sent to the frontend
// cart: { id, user_id, session_id, created_at, updated_at }
// items: [{ id, cart_id, dish_id, quantity, price, item_type_id, item_type_type, item_type_name, ... }]
// ingredients: [{ id, cart_item_id, ingredient_id, quantity, position, ingredient_name, ingredient_price }]
export const toCartDTO = (cart, items, ingredients, totalPrice) => {
	if (!cart) {
		throw new Error('Cart is required');
	}

	// ingredientsByCartItemId: { 2: [{ id: 1, ingredient: { id: 1, name: 'Shari Rice', price: 5 }, quantity: 1, position: 1 }] }
	const ingredientsByCartItemId = {};

	// ingredient: { id: 1, cart_item_id: 2, ingredient_id: 1, quantity: 1, position: 1, ingredient_name: 'Shari Rice', ingredient_price: 5 }
	for (const ingredient of ingredients) {
		if (!ingredientsByCartItemId[ingredient.cart_item_id]) {
			ingredientsByCartItemId[ingredient.cart_item_id] = [];
		}

		ingredientsByCartItemId[ingredient.cart_item_id].push({
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

	// cartDtoItems: [{ id: 1, cart_id: 1, quantity: 2, price: 24, type: {...}, dish: {...}, ingredients: null }]
	const cartDtoItems = [];

	// item: { id: 1, cart_id: 1, dish_id: 1, quantity: 2, price: 24, item_type_id: 1, item_type_type: 'dish', item_type_name: 'Menu Dish' }
	for (const item of items) {
		// cartDtoItem: one item in final cart DTO
		const cartDtoItem = {
			id: item.id,
			cart_id: item.cart_id,
			quantity: item.quantity,
			price: Number(item.price),
			type: {
				id: item.item_type_id,
				type: item.item_type_type || '',
				name: item.item_type_name || '',
			},
			dish: null,
			ingredients: null,
		};

		if (item.item_type_id === 2) {
			// ingredientsByCartItemId[item.id]: [{ id: 1, ingredient: { id: 1, name: 'Shari Rice', price: 5 }, quantity: 1, position: 1 }]
			cartDtoItem.ingredients = ingredientsByCartItemId[item.id] || [];
			cartDtoItems.push(cartDtoItem);
		} else {
			// dish: { id: 1, name: 'Sake Sashimi', description: '...', price: 12, is_available: true, created_at: '...' }
			cartDtoItem.dish = {
				id: item.dish_id,
				name: item.dish_name || '',
				description: item.dish_description || '',
				price: Number(item.dish_price ?? item.price ?? 0),
				is_available: Boolean(item.dish_is_available),
				created_at: item.dish_created_at || null,
				badges: [],
				is_favorite: false,
			}
			cartDtoItems.push(cartDtoItem);
		}
	}

	return {
		id: cart.id,
		user_id: cart.user_id,
		session_id: cart.session_id,
		total_price: Number(totalPrice),
		created_at: cart.created_at,
		updated_at: cart.updated_at,
		items: cartDtoItems,
	};
}
