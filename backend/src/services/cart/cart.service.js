import * as cartRepo from '../../models/db/repositories/cart/cart.repository.js';
import * as cartItemsRepo from '../../models/db/repositories/cart/cartItems.repository.js';
import * as cartItemIngredientsRepo from '../../models/db/repositories/cart/cartItemIngredients.repository.js';
import * as mapper from './cart.mapper.js';

// Create cart for user
export const createCartByUserId = async (userId, items = []) => {
    const oldCart = await cartRepo.getCartRowByUserId(userId);

    if (oldCart) {
        await cartRepo.deleteCart(oldCart.id);
    }

    await cartRepo.createCartByUserId(userId);

    for (const item of items) {
        const cart = await cartRepo.getCartRowByUserId(userId);

        if (!cart) {
            throw new Error('Cart was not created');
        }

        const cartItemId = await cartItemsRepo.createCartItem({
            cart_id: cart.id,
            dish_id: item.dish_id,
            quantity: item.quantity,
            price: Number(item.price || 0),
            item_type_id: item.item_type_id,
        });

        if (item.ingredients) {
            for (const ingredient of item.ingredients) {
                await cartItemIngredientsRepo.createCartItemIngredient({
                    cart_item_id: cartItemId,
                    ingredient_id: ingredient.ingredient_id,
                    quantity: ingredient.quantity,
                    position: ingredient.position,
                });
            }
        }
    }

  return getCartByUserId(userId);
}

// Create cart for session
export const createCartBySessionId = async (sessionId, items = []) => {
    const oldCart = await cartRepo.getCartRowBySessionId(sessionId);

    if (oldCart) {
        await cartRepo.deleteCart(oldCart.id);
    }

    await cartRepo.createCartBySessionId(sessionId);

    for (const item of items) {
        const cart = await cartRepo.getCartRowBySessionId(sessionId);

        if (!cart) {
            throw new Error('Cart was not created');
        }

        const cartItemId = await cartItemsRepo.createCartItem({
            cart_id: cart.id,
            dish_id: item.dish_id,
            quantity: item.quantity,
            price: Number(item.price || 0),
            item_type_id: item.item_type_id,
        });

        if (item.ingredients) {
            for (const ingredient of item.ingredients) {
                await cartItemIngredientsRepo.createCartItemIngredient({
                    cart_item_id: cartItemId,
                    ingredient_id: ingredient.ingredient_id,
                    quantity: ingredient.quantity,
                    position: ingredient.position,
                });
            }
        }
    }

  return getCartBySessionId(sessionId);
}

// Get cart for user
export const getCartByUserId = async (userId) => {
    const cart = await cartRepo.getCartRowByUserId(userId);

    if (!cart) {
        return null;
    }

    const items = await cartItemsRepo.getCartItemRowsByCartId(cart.id);
    let ingredients = [];

    for (const item of items) {
        const itemIngredients = await cartItemIngredientsRepo.getCartItemIngredientRowsByCartItemId(item.id);
        ingredients = ingredients.concat(itemIngredients);
    }

  return mapper.toCartDTO(cart, items, ingredients);
}

// Get cart for session
export const getCartBySessionId = async (sessionId) => {
    const cart = await cartRepo.getCartRowBySessionId(sessionId);

    if (!cart) {
        return null;
    }

    const items = await cartItemsRepo.getCartItemRowsByCartId(cart.id);
    let ingredients = [];

    for (const item of items) {
        const itemIngredients = await cartItemIngredientsRepo.getCartItemIngredientRowsByCartItemId(item.id);
        ingredients = ingredients.concat(itemIngredients);
    }

  return mapper.toCartDTO(cart, items, ingredients);
}

// Update cart for user
export const updateCartByUserId = async (userId, items = []) => {
    const cart = await cartRepo.getCartRowByUserId(userId);

    if (!cart) {
        return createCartByUserId(userId, items);
    }

    const filteredItems = items.filter(item => {
        return !(item.item_type_id === 2 && (!item.ingredients || item.ingredients.length === 0));
    });

    if (filteredItems.length === 0) {
        await cartRepo.deleteCart(cart.id);
        return null;
    }

    const oldItems = await cartItemsRepo.getCartItemRowsByCartId(cart.id);

    for (const oldItem of oldItems) {
        const itemStillExists = filteredItems.find(item => item.id === oldItem.id);

        if (!itemStillExists) {
            const oldIngredients = await cartItemIngredientsRepo.getCartItemIngredientRowsByCartItemId(oldItem.id);

            for (const ingredient of oldIngredients) {
                await cartItemIngredientsRepo.deleteCartItemIngredient(ingredient.id);
            }

            await cartItemsRepo.deleteCartItem(oldItem.id);
        }
    }

    for (const item of filteredItems) {
        if (item.id) {
            await cartItemsRepo.updateCartItem({
                id: item.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: Number(item.price || 0),
                item_type_id: item.item_type_id,
            });

            const oldIngredients = await cartItemIngredientsRepo.getCartItemIngredientRowsByCartItemId(item.id);

            for (const ingredient of oldIngredients) {
                await cartItemIngredientsRepo.deleteCartItemIngredient(ingredient.id);
            }

            if (item.ingredients) {
                for (const ingredient of item.ingredients) {
                    await cartItemIngredientsRepo.createCartItemIngredient({
                        cart_item_id: item.id,
                        ingredient_id: ingredient.ingredient_id,
                        quantity: ingredient.quantity,
                        position: ingredient.position,
                    });
                }
            }
        } else {
            const cartItemId = await cartItemsRepo.createCartItem({
                cart_id: cart.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: Number(item.price || 0),
                item_type_id: item.item_type_id,
            });

            if (item.ingredients) {
                for (const ingredient of item.ingredients) {
                    await cartItemIngredientsRepo.createCartItemIngredient({
                        cart_item_id: cartItemId,
                        ingredient_id: ingredient.ingredient_id,
                        quantity: ingredient.quantity,
                        position: ingredient.position,
                    });
                }
            }
        }
    }

    await cartRepo.updateCartByUserId(userId);

  return getCartByUserId(userId);
}

// Update cart for session
export const updateCartBySessionId = async (sessionId, items = []) => {
    const cart = await cartRepo.getCartRowBySessionId(sessionId);

    if (!cart) {
        return createCartBySessionId(sessionId, items);
    }

    const filteredItems = items.filter(item => {
        return !(item.item_type_id === 2 && (!item.ingredients || item.ingredients.length === 0));
    });

    if (filteredItems.length === 0) {
        await cartRepo.deleteCart(cart.id);
        return null;
    }

    const oldItems = await cartItemsRepo.getCartItemRowsByCartId(cart.id);

    for (const oldItem of oldItems) {
        const itemStillExists = filteredItems.find(item => item.id === oldItem.id);

        if (!itemStillExists) {
            const oldIngredients = await cartItemIngredientsRepo.getCartItemIngredientRowsByCartItemId(oldItem.id);

            for (const ingredient of oldIngredients) {
                await cartItemIngredientsRepo.deleteCartItemIngredient(ingredient.id);
            }

            await cartItemsRepo.deleteCartItem(oldItem.id);
        }
    }

    for (const item of filteredItems) {
        if (item.id) {
            await cartItemsRepo.updateCartItem({
                id: item.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: Number(item.price || 0),
                item_type_id: item.item_type_id,
            });

            const oldIngredients = await cartItemIngredientsRepo.getCartItemIngredientRowsByCartItemId(item.id);

            for (const ingredient of oldIngredients) {
                await cartItemIngredientsRepo.deleteCartItemIngredient(ingredient.id);
            }

            if (item.ingredients) {
                for (const ingredient of item.ingredients) {
                    await cartItemIngredientsRepo.createCartItemIngredient({
                        cart_item_id: item.id,
                        ingredient_id: ingredient.ingredient_id,
                        quantity: ingredient.quantity,
                        position: ingredient.position,
                    });
                }
            }
        } else {
            const cartItemId = await cartItemsRepo.createCartItem({
                cart_id: cart.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: Number(item.price || 0),
                item_type_id: item.item_type_id,
            });

            if (item.ingredients) {
                for (const ingredient of item.ingredients) {
                    await cartItemIngredientsRepo.createCartItemIngredient({
                        cart_item_id: cartItemId,
                        ingredient_id: ingredient.ingredient_id,
                        quantity: ingredient.quantity,
                        position: ingredient.position,
                    });
                }
            }
        }
    }

    await cartRepo.updateCartBySessionId(sessionId);

  return getCartBySessionId(sessionId);
}

// Delete cart for user
export const deleteCartByUserId = async (userId) => {
    const cart = await cartRepo.getCartRowByUserId(userId);

    if (!cart) {
        return false;
    }

    await cartRepo.deleteCart(cart.id);

  return true;
}

// Delete cart for session
export const deleteCartBySessionId = async (sessionId) => {
    const cart = await cartRepo.getCartRowBySessionId(sessionId);

    if (!cart) {
        return false;
    }

    await cartRepo.deleteCart(cart.id);

    return true;
}
