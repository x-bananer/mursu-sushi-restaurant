import * as ingredientRepo from '../../models/db/repositories/dish/ingredients.repository.js';
import * as cartService from '../cart/cart.service.js';
import * as comboEngine from '../../models/engine/combo.engine.js';

function createHttpError(statusCode, message) {
    const error = /** @type {Error & { statusCode: number }} */ (new Error(message));
    error.statusCode = statusCode;
    return error;
}

export async function previewCombo(ingredientsFromClient = [], withValidation = false) {
    const ingredientsFromDb = await ingredientRepo.getIngredients();

    const combo = comboEngine.buildCombo(ingredientsFromClient, ingredientsFromDb, withValidation);
    return combo;
}

export async function createCombo(sessionId, ingredientsFromClient) {
    let validatedCombo;
    try {
        validatedCombo = await previewCombo(ingredientsFromClient, true);
    } catch (error) {
        throw createHttpError(400, error.message || 'Invalid combo data');
    }

    const currentCart = await cartService.getCartBySessionId(sessionId);

    const currentCartItems = (currentCart?.items || []).map((item) => ({
        id: item.id,
        dish_id: item.dish?.id ?? null,
        quantity: Number(item.quantity),
        item_type_id: Number(item.type?.id),
        ingredients: item.ingredients
            ? item.ingredients.map((ingredient) => ({
                ingredient_id: Number(ingredient.ingredient.id),
                quantity: Number(ingredient.quantity),
                position: Number(ingredient.position),
            }))
            : null,
    }));

    const newCartItem = {
        dish_id: null,
        quantity: 1,
        item_type_id: 2,
        ingredients: validatedCombo.ingredients,
    };

    const updatedCartItems = [...currentCartItems, newCartItem];
    const cart = await cartService.updateCartBySessionId(sessionId, updatedCartItems);
    return cart;
}


export async function listComboIngredients() {
    const ingredients = await ingredientRepo.getIngredients();
    const ingredientTypes = await ingredientRepo.getIngredientTypes();

    const formattedIngredients = ingredients.map((ingredient) => {
        const currentIngredientType = ingredientTypes.find(
            (type) => Number(type.id) === Number(ingredient.ingredient_type_id)
        );

        return {
            ...ingredient,
            type: currentIngredientType ?? null,
        };
    });

    return formattedIngredients;
}
