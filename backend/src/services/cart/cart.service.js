import * as cartRepo from '../../models/db/repositories/cart/cart.repository.js';
import * as cartItemsRepo from '../../models/db/repositories/cart/cartItems.repository.js';
import * as cartItemIngredientsRepository from '../../models/db/repositories/cart/cartItemIngredients.repository.js';
import * as userRepo from '../../models/db/repositories/user/user.repository.js';
import * as dailySpecialRepo from '../../models/db/repositories/dish/dailySpecial.repository.js';
import * as orderService from '../order/order.service.js';
import * as cartMapper from './cart.mapper.js';
import * as cartEngine from '../../models/engine/cart.engine.js';

function createHttpError(statusCode, message) {
    const error = /** @type {Error & { statusCode: number }} */ (new Error(message));
    error.statusCode = statusCode;
    return error;
}

// Create cart for session
export const createCartBySessionId = async (sessionId, items = []) => {
    if (!sessionId) {
        throw createHttpError(400, 'Missing session_id');
    }

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

// Get cart for session
export const getCartBySessionId = async (sessionId) => {
    if (!sessionId) {
        throw createHttpError(400, 'Missing session_id');
    }

    const cart = await cartRepo.getCartBySessionId(sessionId);

    if (!cart) {
        return null;
    }

    const items = await cartItemsRepo.getCartItemsByCartId(cart.id);
    const ingredients = await getCartIngredients(items);
    const {totalPrice, discount} = await getCartTotalPrice(cart, items);

    return cartMapper.toCartDTO(
        cart,
        items,
        ingredients,
        totalPrice,
        discount
    );
}

// Update/create the whole cart for session
export const updateCartBySessionId = async (sessionId, items = []) => {
    if (!sessionId) {
        throw createHttpError(400, 'Missing session_id');
    }

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

// Update/create ona cart dish for session
export const updateCartDishBySessionId = async (sessionId, dishId, quantity) => {
    if (!sessionId) {
        throw createHttpError(400, 'Missing session_id');
    }

    if (!Number(dishId)) {
        throw createHttpError(400, 'Valid dish_id is required');
    }

    if (Number.isNaN(Number(quantity)) || Number(quantity) < 0) {
        throw createHttpError(400, 'Valid quantity is required');
    }

    let cart = await cartRepo.getCartBySessionId(sessionId);
    if (!cart) {
        await cartRepo.createCartBySessionId(sessionId);
        cart = await cartRepo.getCartBySessionId(sessionId);
    }

    const cartItems = await cartItemsRepo.getCartItemsByCartId(cart.id);

    const existingDishItem = cartItems.find((item) => {
        return Number(item.item_type_id) === 1 && Number(item.dish_id) === Number(dishId);
    });

    if (Number(quantity) === 0) {
        if (existingDishItem) {
            await cartItemsRepo.deleteCartItem(existingDishItem.id);
            await cartRepo.updateCartBySessionId(sessionId);
        }

        return getCartBySessionId(sessionId);
    }

    const itemPrice = await getDishItemPrice({ dish_id: Number(dishId) });

    if (existingDishItem) {
        await cartItemsRepo.updateCartItem({
            id: existingDishItem.id,
            dish_id: Number(dishId),
            quantity: Number(quantity),
            price: itemPrice,
            item_type_id: 1,
        });
    } else {
        await cartItemsRepo.createCartItem({
            cart_id: cart.id,
            dish_id: Number(dishId),
            quantity: Number(quantity),
            price: itemPrice,
            item_type_id: 1,
        });
    }

    await cartRepo.updateCartBySessionId(sessionId);
    return getCartBySessionId(sessionId);
}

// Clear cart for session
export const clearCartBySessionId = async (sessionId) => {
    if (!sessionId) {
        throw createHttpError(400, 'Missing session_id');
    }

    const cart = await cartRepo.getCartBySessionId(sessionId);

    if (!cart) {
        return false;
    }

    await cartItemsRepo.deleteCartItemsByCartId(cart.id);
    await cartRepo.updateCartBySessionId(sessionId);

    return true;
}

export const addUserIdToCart = async (sessionId, userId) => {
    if (!sessionId) {
        throw createHttpError(400, 'Missing session_id');
    }

    if (!userId) {
        throw createHttpError(400, 'Missing user_id');
    }

    let cart = await cartRepo.getCartBySessionId(sessionId);
    if (!cart) {
        await cartRepo.createCartBySessionId(sessionId);
        cart = await cartRepo.getCartBySessionId(sessionId);
    }

    const sessionCartItems = await cartItemsRepo.getCartItemsByCartId(cart.id);

    if (sessionCartItems.length === 0) {
        await cartRepo.deleteCartById(cart.id);
        await cartRepo.updateCartSessionIdByUserId(userId, sessionId);
        const userCartInSession = await cartRepo.getCartBySessionId(sessionId);

        if (!userCartInSession) {
            await cartRepo.createCartBySessionId(sessionId);
        }

        const refreshedCart = await cartRepo.getCartBySessionId(sessionId);
        if (refreshedCart && !refreshedCart.user_id) {
            await cartRepo.addUserIdToCart(sessionId, userId);
        }

        return;
    }

    await cartRepo.addUserIdToCart(sessionId, userId);
}

export const checkoutCartBySessionId = async (sessionId, userId, checkoutData) => {
    if (!sessionId) {
        throw createHttpError(400, 'Missing session_id');
    }

    if (!Number.isInteger(userId)) {
        throw createHttpError(401, 'Unauthorized');
    }

    if (!checkoutData.delivery_type_id) {
        throw createHttpError(400, 'Missing checkout data');
    }

    if (Number(checkoutData.delivery_type_id) === 3 && !String(checkoutData.address).trim()) {
        throw createHttpError(400, 'Address is required for delivery');
    }

    const cart = await getCartBySessionId(sessionId);

    if (!cart) {
        throw createHttpError(404, 'Cart not found');
    }

    if (!cart.items.length) {
        throw createHttpError(400, 'Cart is empty');
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
        address: String(checkoutData.address ?? '').trim(),
        total_price: Number(cart.total_price),
        order_items: orderItems,
    });

    const userDiscountData = await userRepo.getUserDiscountStateById(userId);

    if (userDiscountData.is_stamp_discount_active) {
        await userRepo.updateIsStampDiscountActive(userId, false);
        await userRepo.updateStampCount(userId, 0);
    } else {
        const nextStampCount = userDiscountData.stamp_count + 1;
        await userRepo.updateStampCount(userId, nextStampCount);

        if (nextStampCount >= 5) {
            await userRepo.updateIsStampDiscountActive(userId, true);
        }
    }

    return order;
}

export const getDeliveryTypes = async () => {
    return cartRepo.getDeliveryTypes();
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
const getCartTotalPrice = async (cart, items) => {
    try {
        let hasStampDiscount = false;
        if (cart?.user_id) {
            const userDiscountData = await userRepo.getUserDiscountStateById(cart.user_id);
            hasStampDiscount = userDiscountData?.is_stamp_discount_active;
        }

        const dailySpecials = await dailySpecialRepo.getDailySpecial();
        const dailySpecialsIds = dailySpecials.map((dish) => Number(dish.id));

        return cartEngine.calculateCartTotalPrice(items, hasStampDiscount, dailySpecialsIds);

    } catch (error) {
        throw toInvalidCartDataError(error);
    }
}

const toInvalidCartDataError = (error) => {
    console.error('Cart validation failed:', error);
    return new Error('Invalid cart data');
}
