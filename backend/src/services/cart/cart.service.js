import * as cartRepo from '../../models/db/repositories/cart/cart.repository.js';
import * as cartItemsRepo from '../../models/db/repositories/cart/cartItems.repository.js';
import * as cartItemIngredientsRepository from '../../models/db/repositories/cart/cartItemIngredients.repository.js';
import * as orderService from '../order/order.service.js';
import * as cartMapper from './cart.mapper.js';
import * as cartEngine from '../../models/engine/cart.engine.js';

// Create cart for user
export const createCartByUserId = async (userId, items = []) => {
    let cart = await cartRepo.getCartByUserId(userId);

    if (cart) {
        await cartItemsRepo.deleteCartItemsByCartId(cart.id);
        await cartRepo.updateCartByUserId(userId);
    } else {
        await cartRepo.createCartByUserId(userId);
        cart = await cartRepo.getCartByUserId(userId);
    }

    if (!cart) {
        throw new Error('Cart was not created');
    }

    for (const item of items) {
        const itemPrice = await getItemPrice(item);

        const cartItemId = await cartItemsRepo.createCartItem({
            cart_id: cart.id,
            dish_id: item.dish_id,
            quantity: item.quantity,
            price: itemPrice,
            item_type_id: item.item_type_id,
        });

        if (item.ingredients) {
            await createCartItemIngredients(cartItemId, item.ingredients);
        }
    }

    return getCartByUserId(userId);
}

// Create cart for session
export const createCartBySessionId = async (sessionId, items = []) => {
    let cart = await cartRepo.getCartBySessionId(sessionId);

    if (cart) {
        await cartItemsRepo.deleteCartItemsByCartId(cart.id);
        await cartRepo.updateCartBySessionId(sessionId);
    } else {
        await cartRepo.createCartBySessionId(sessionId);
        cart = await cartRepo.getCartBySessionId(sessionId);
    }

    if (!cart) {
        throw new Error('Cart was not created');
    }

    for (const item of items) {
        const itemPrice = await getItemPrice(item);

        const cartItemId = await cartItemsRepo.createCartItem({
            cart_id: cart.id,
            dish_id: item.dish_id,
            quantity: item.quantity,
            price: itemPrice,
            item_type_id: item.item_type_id,
        });

        if (item.ingredients) {
            await createCartItemIngredients(cartItemId, item.ingredients);
        }
    }

    return getCartBySessionId(sessionId);
}

// Get cart for user
export const getCartByUserId = async (userId) => {
    const cart = await cartRepo.getCartByUserId(userId);

    if (!cart) {
        return null;
    }

    const items = await cartItemsRepo.getCartItemsByCartId(cart.id);
    const ingredients = await getCartIngredients(items);
    const totalPrice = getCartTotalPrice(items);

    return cartMapper.toCartDTO(cart, items, ingredients, totalPrice);
}

// Get cart for session
export const getCartBySessionId = async (sessionId) => {
    const cart = await cartRepo.getCartBySessionId(sessionId);

    if (!cart) {
        return null;
    }

    const items = await cartItemsRepo.getCartItemsByCartId(cart.id);
    const ingredients = await getCartIngredients(items);
    const totalPrice = getCartTotalPrice(items);

    return cartMapper.toCartDTO(cart, items, ingredients, totalPrice);
}

// Update cart for user
export const updateCartByUserId = async (userId, items = []) => {
    const cart = await cartRepo.getCartByUserId(userId);

    if (!cart) {
        return createCartByUserId(userId, items);
    }

    const filteredItems = items.filter(item => {
        return !(item.item_type_id === 2 && (!item.ingredients || item.ingredients.length === 0));
    });

    if (filteredItems.length === 0) {
        await cartItemsRepo.deleteCartItemsByCartId(cart.id);
        await cartRepo.updateCartByUserId(userId);
        return getCartByUserId(userId);
    }

    const oldItems = await cartItemsRepo.getCartItemsByCartId(cart.id);
    const oldItemIds = oldItems.map(item => item.id);
    const oldIngredients = await cartItemIngredientsRepository.getCartItemIngredientsByCartItemIds(oldItemIds);
    const filteredItemsMap = {};
    const oldIngredientsMap = {};

    for (const ingredient of oldIngredients) {
        if (!oldIngredientsMap[ingredient.cart_item_id]) {
            oldIngredientsMap[ingredient.cart_item_id] = [];
        }

        oldIngredientsMap[ingredient.cart_item_id].push(ingredient);
    }

    for (const item of filteredItems) {
        if (item.id) {
            filteredItemsMap[item.id] = true;
        }
    }

    for (const oldItem of oldItems) {
        if (!filteredItemsMap[oldItem.id]) {
            await deleteCartItemIngredients(oldIngredientsMap[oldItem.id] || []);
            await cartItemsRepo.deleteCartItem(oldItem.id);
        }
    }

    for (const item of filteredItems) {
        if (item.id) {
            const itemPrice = await getItemPrice(item);

            await cartItemsRepo.updateCartItem({
                id: item.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: itemPrice,
                item_type_id: item.item_type_id,
            });

            await deleteCartItemIngredients(oldIngredientsMap[item.id] || []);

            if (item.ingredients) {
                await createCartItemIngredients(item.id, item.ingredients);
            }
        } else {
            const itemPrice = await getItemPrice(item);

            const cartItemId = await cartItemsRepo.createCartItem({
                cart_id: cart.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: itemPrice,
                item_type_id: item.item_type_id,
            });

            if (item.ingredients) {
                await createCartItemIngredients(cartItemId, item.ingredients);
            }
        }
    }

    await cartRepo.updateCartByUserId(userId);

    return getCartByUserId(userId);
}

// Update cart for session
export const updateCartBySessionId = async (sessionId, items = []) => {
    const cart = await cartRepo.getCartBySessionId(sessionId);

    if (!cart) {
        return createCartBySessionId(sessionId, items);
    }

    const filteredItems = items.filter(item => {
        return !(item.item_type_id === 2 && (!item.ingredients || item.ingredients.length === 0));
    });

    if (filteredItems.length === 0) {
        await cartItemsRepo.deleteCartItemsByCartId(cart.id);
        await cartRepo.updateCartBySessionId(sessionId);
        return getCartBySessionId(sessionId);
    }

    const oldItems = await cartItemsRepo.getCartItemsByCartId(cart.id);
    const oldItemIds = oldItems.map(item => item.id);
    const oldIngredients = await cartItemIngredientsRepository.getCartItemIngredientsByCartItemIds(oldItemIds);
    const filteredItemsMap = {};
    const oldIngredientsMap = {};

    for (const ingredient of oldIngredients) {
        if (!oldIngredientsMap[ingredient.cart_item_id]) {
            oldIngredientsMap[ingredient.cart_item_id] = [];
        }

        oldIngredientsMap[ingredient.cart_item_id].push(ingredient);
    }

    for (const item of filteredItems) {
        if (item.id) {
            filteredItemsMap[item.id] = true;
        }
    }

    for (const oldItem of oldItems) {
        if (!filteredItemsMap[oldItem.id]) {
            await deleteCartItemIngredients(oldIngredientsMap[oldItem.id] || []);
            await cartItemsRepo.deleteCartItem(oldItem.id);
        }
    }

    for (const item of filteredItems) {
        if (item.id) {
            const itemPrice = await getItemPrice(item);

            await cartItemsRepo.updateCartItem({
                id: item.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: itemPrice,
                item_type_id: item.item_type_id,
            });

            await deleteCartItemIngredients(oldIngredientsMap[item.id] || []);

            if (item.ingredients) {
                await createCartItemIngredients(item.id, item.ingredients);
            }
        } else {
            const itemPrice = await getItemPrice(item);

            const cartItemId = await cartItemsRepo.createCartItem({
                cart_id: cart.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: itemPrice,
                item_type_id: item.item_type_id,
            });

            if (item.ingredients) {
                await createCartItemIngredients(cartItemId, item.ingredients);
            }
        }
    }

    await cartRepo.updateCartBySessionId(sessionId);

    return getCartBySessionId(sessionId);
}

// Clear cart for user
export const clearCartByUserId = async (userId) => {
    const cart = await cartRepo.getCartByUserId(userId);

    if (!cart) {
        return false;
    }

    await cartItemsRepo.deleteCartItemsByCartId(cart.id);
    await cartRepo.updateCartByUserId(userId);

    return true;
}

// Clear cart for session
export const clearCartBySessionId = async (sessionId) => {
    const cart = await cartRepo.getCartBySessionId(sessionId);

    if (!cart) {
        return false;
    }

    await cartItemsRepo.deleteCartItemsByCartId(cart.id);
    await cartRepo.updateCartBySessionId(sessionId);

    return true;
}

// Create order from cart and clear cart
export const checkoutCartByUserId = async (userId, checkoutData) => {
    const cart = await getCartByUserId(userId);

    if (!cart) {
        throw new Error('Cart not found');
    }

    if (!cart.items.length) {
        throw new Error('Cart is empty');
    }

    const orderItems = cart.items.map((item) => {
        if (item.type.type === 'custom') {
            return {
                dish_id: null,
                name: item.type.name || 'Custom Combo',
                quantity: Number(item.quantity),
                price: Number(item.price),
                item_type_id: item.type.id,
                ingredients: (item.ingredients || []).map((ingredient) => ({
                    ingredient_id: ingredient.ingredient.id,
                    quantity: Number(ingredient.quantity),
                    position: Number(ingredient.position),
                })),
            };
        }

        return {
            dish_id: item.dish?.id || null,
            name: item.dish?.name || '',
            quantity: Number(item.quantity),
            price: Number(item.price),
            item_type_id: item.type.id,
            ingredients: [],
        };
    });

    const order = await orderService.createOrder({
        user_id: userId,
        delivery_type_id: checkoutData.delivery_type_id,
        address: checkoutData.address,
        total_price: Number(cart.total_price),
        order_items: orderItems,
    });

    await clearCartByUserId(userId);

    return order;
}

// Get item price
// item: { dish_id: 1, quantity: 2, item_type_id: 1 }
const getItemPrice = async (item) => {
    try {
        if (item.item_type_id === 1) {
            return await getDishItemPrice(item);
        }

        if (item.item_type_id === 2) {
            return await getCustomItemPrice(item);
        }

        throw new Error('Invalid cart item type');
    } catch (error) {
        throw toInvalidCartDataError(error);
    }
}

// Get saved dish price from DB
const getDishItemPrice = async (item) => {
    // dish: { id: 1, name: 'Sake Sashimi', price: 12 }
    const dish = await cartItemsRepo.getDishById(item.dish_id);

    if (!dish) {
        throw new Error('Dish not found');
    }

    return Number(dish.price);
}

// Calculate custom item price from selected ingredients
// item: { item_type_id: 2, quantity: 1, ingredients: [{ ingredient_id: 1, quantity: 1, position: 1 }] }
const getCustomItemPrice = async (item) => {
    // itemIngredients: [{ ingredient_id: 1, quantity: 1, position: 1 }]
    const itemIngredients = item.ingredients || [];
    // itemIngredientIds: [1, 12, 21]
    const itemIngredientIds = itemIngredients.map((ingredient) => ingredient.ingredient_id);

    // ingredients: [{ id: 1, name: 'Shari Rice', price: 5 }]
    const ingredients = await cartItemIngredientsRepository.getIngredientsByIds(itemIngredientIds);

    // totalPrice: 23
    let totalPrice = 0;

    // itemIngredient: { ingredient_id: 1, quantity: 1, position: 1 }
    for (const itemIngredient of itemIngredients) {
        // ingredient: { id: 1, name: 'Shari Rice', price: 5 }
        const ingredient = ingredients.find(
            (dbIngredient) => dbIngredient.id === itemIngredient.ingredient_id
        );

        if (!ingredient) {
            throw new Error('Ingredient not found');
        }

        totalPrice += Number(ingredient.price) * Number(itemIngredient.quantity);
    }

    return totalPrice;
}

// Get all ingredients for cart items
// items: [{ id: 1, price: 12, quantity: 2 }]
const getCartIngredients = async (items) => {
    // ingredients: [{ id: 1, cart_item_id: 2, ingredient_id: 1, quantity: 1, position: 1 }]
    let ingredients = [];

    for (const item of items) {
        // itemIngredients: [{ id: 1, cart_item_id: 2, ingredient_id: 1, quantity: 1, position: 1 }]
        const itemIngredients = await cartItemIngredientsRepository.getCartItemIngredientsByCartItemId(item.id);
        ingredients = ingredients.concat(itemIngredients);
    }

    return ingredients;
}

// Create ingredients for one cart item
// cartItemId: 2
// ingredients: [{ ingredient_id: 1, quantity: 1, position: 1 }]
const createCartItemIngredients = async (cartItemId, ingredients) => {
    for (const ingredient of ingredients) {
        await cartItemIngredientsRepository.createCartItemIngredient({
            cart_item_id: cartItemId,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity,
            position: ingredient.position,
        });
    }
}

// Delete ingredients for one cart item
// ingredients: [{ id: 1, cart_item_id: 2, ingredient_id: 1, quantity: 1, position: 1 }]
const deleteCartItemIngredients = async (ingredients) => {
    for (const ingredient of ingredients) {
        await cartItemIngredientsRepository.deleteCartItemIngredient(ingredient.id);
    }
}

// Calculate final cart total price from cart items
// items: [{ id: 1, price: 12, quantity: 2 }]
const getCartTotalPrice = (items) => {
    try {
        return cartEngine.calculateCartTotalPrice(items);

    } catch (error) {
        throw toInvalidCartDataError(error);
    }
}

const toInvalidCartDataError = (error) => {
    console.error('Cart validation failed:', error);
    return new Error('Invalid cart data');
}
