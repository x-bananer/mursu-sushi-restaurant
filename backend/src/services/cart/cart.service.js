import * as cartRepo from '../../models/db/repositories/cart/cart.repository.js';
import * as cartItemsRepo from '../../models/db/repositories/cart/cartItems.repository.js';
import * as cartItemIngredientsRepo from '../../models/db/repositories/cart/cartItemIngredients.repository.js';
import * as mapper from './cart.mapper.js';

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

    return mapper.toCartDTO(cart, items, ingredients);
}

// Get cart for session
export const getCartBySessionId = async (sessionId) => {
    const cart = await cartRepo.getCartBySessionId(sessionId);

    if (!cart) {
        return null;
    }

    const items = await cartItemsRepo.getCartItemsByCartId(cart.id);
    const ingredients = await getCartIngredients(items);

    return mapper.toCartDTO(cart, items, ingredients);
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
    const oldIngredients = await cartItemIngredientsRepo.getCartItemIngredientsByCartItemIds(oldItemIds);
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
    const oldIngredients = await cartItemIngredientsRepo.getCartItemIngredientsByCartItemIds(oldItemIds);
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

// Get item price
const getItemPrice = async (item) => {
    if (item.item_type_id === 1) {
        const dish = await cartItemsRepo.getDishById(item.dish_id);

        if (!dish) {
            throw new Error('Dish not found');
        }

        return Number(dish.price);
    }

    if (item.item_type_id === 2) {
        const ingredients = item.ingredients || [];
        const ingredientIds = [];

        for (const ingredient of ingredients) {
            ingredientIds.push(ingredient.ingredient_id);
        }

        const ingredientsData = await cartItemIngredientsRepo.getIngredientsByIds(ingredientIds);
        const ingredientsMap = {};
        let price = 0;

        for (const ingredientFromDb of ingredientsData) {
            ingredientsMap[ingredientFromDb.id] = ingredientFromDb;
        }

        for (const ingredient of ingredients) {
            const ingredientData = ingredientsMap[ingredient.ingredient_id];

            if (!ingredientData) {
                throw new Error('Ingredient not found');
            }

            price = price + Number(ingredientData.price) * Number(ingredient.quantity);
        }

        return price;
    }

    return 0;
}

// Get all ingredients for cart items
const getCartIngredients = async (items) => {
    let ingredients = [];

    for (const item of items) {
        const itemIngredients = await cartItemIngredientsRepo.getCartItemIngredientsByCartItemId(item.id);
        ingredients = ingredients.concat(itemIngredients);
    }

    return ingredients;
}

// Create ingredients for one cart item
const createCartItemIngredients = async (cartItemId, ingredients) => {
    for (const ingredient of ingredients) {
        await cartItemIngredientsRepo.createCartItemIngredient({
            cart_item_id: cartItemId,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity,
            position: ingredient.position,
        });
    }
}

// Delete ingredients for one cart item
const deleteCartItemIngredients = async (ingredients) => {
    for (const ingredient of ingredients) {
        await cartItemIngredientsRepo.deleteCartItemIngredient(ingredient.id);
    }
}
