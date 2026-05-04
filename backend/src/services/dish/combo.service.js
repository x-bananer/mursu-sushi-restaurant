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

export async function createIngredient(payload = {}) {
    const name = String(payload?.name ?? "").trim();
    const price = Number(payload?.price);
    const ingredientTypeId = Number(payload?.ingredient_type_id);

    if (!name) {
        throw createHttpError(400, "Ingredient name is required");
    }

    if (Number.isNaN(price) || price < 0) {
        throw createHttpError(400, "Valid ingredient price is required");
    }

    if (!Number.isInteger(ingredientTypeId) || ingredientTypeId <= 0) {
        throw createHttpError(400, "Valid ingredient_type_id is required");
    }

    const ingredientId = await ingredientRepo.createIngredient({
        name,
        price,
        ingredient_type_id: ingredientTypeId,
    });
    
    return ingredientRepo.getIngredientById(ingredientId);
}

export async function updateIngredient(ingredientId, payload = {}) {
    if (!Number.isInteger(ingredientId) || ingredientId <= 0) {
        throw createHttpError(400, "Valid ingredient id is required");
    }

    const updates = {};

    if (payload.name !== undefined) {
        const name = String(payload.name).trim();
        if (!name) {
            throw createHttpError(400, "Ingredient name cannot be empty");
        }
        updates.name = name;
    }

    if (payload.price !== undefined) {
        const price = Number(payload.price);
        if (Number.isNaN(price) || price < 0) {
            throw createHttpError(400, "Valid ingredient price is required");
        }
        updates.price = price;
    }

    if (payload.ingredient_type_id !== undefined) {
        const ingredientTypeId = Number(payload.ingredient_type_id);
        if (!Number.isInteger(ingredientTypeId) || ingredientTypeId <= 0) {
            throw createHttpError(400, "Valid ingredient_type_id is required");
        }
        updates.ingredient_type_id = ingredientTypeId;
    }

    if (Object.keys(updates).length === 0) {
        throw createHttpError(400, "No fields provided for update");
    }

    const isUpdated = await ingredientRepo.updateIngredientById(ingredientId, updates);

    if (!isUpdated) {
        throw createHttpError(404, "Ingredient not found");
    }

    return ingredientRepo.getIngredientById(ingredientId);
}

export async function deleteIngredient(ingredientId) {
    if (!Number.isInteger(ingredientId) || ingredientId <= 0) {
        throw createHttpError(400, "Valid ingredient id is required");
    }

    const isDeleted = await ingredientRepo.deleteIngredientById(ingredientId);

    if (!isDeleted) {
        throw createHttpError(404, "Ingredient not found");
    }

    return true;
}
