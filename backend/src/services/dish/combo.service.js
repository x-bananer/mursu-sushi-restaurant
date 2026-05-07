import * as ingredientRepo from '../../models/db/repositories/dish/ingredients.repository.js';
import * as cartService from '../cart/cart.service.js';
import * as comboEngine from '../../models/engine/combo.engine.js';
import { t } from '../../i18n/messages.js';

function createHttpError(statusCode, message) {
    const error = /** @type {Error & { statusCode: number }} */ (new Error(message));
    error.statusCode = statusCode;
    return error;
}

export async function previewCombo(ingredientsFromClient = [], withValidation = false, locale) {
    try {
        const ingredientsFromDb = await ingredientRepo.getIngredients();
        const availableIngredients = ingredientsFromDb.filter((ingredient) => {
            return Boolean(ingredient?.is_available);
        });

        if (Array.isArray(ingredientsFromClient) && ingredientsFromClient.length) {
            for (const clientIngredient of ingredientsFromClient) {
                const ingredientId = Number(clientIngredient?.ingredient_id);
                const exists = availableIngredients.find((ingredient) => {
                    return Number(ingredient.id) === ingredientId;
                });

                if (!exists) {
                    throw createHttpError(400, t(locale, 'combo', 'ingredient_unavailable'));
                }
            }
        }

        const combo = comboEngine.buildCombo(ingredientsFromClient, availableIngredients, withValidation);
        return combo;
    } catch (error) {
        throw createHttpError(400, error?.message || t(locale, 'combo', 'invalid_combo_data'));
    }
}

export async function createCombo(sessionId, ingredientsFromClient, locale) {
    let validatedCombo;
    try {
        validatedCombo = await previewCombo(ingredientsFromClient, true, locale);
    } catch (error) {
        throw createHttpError(400, error.message || t(locale, 'combo', 'invalid_combo_data'));
    }

    const currentCart = await cartService.getCartBySessionId(sessionId, locale);

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
    const cart = await cartService.updateCartBySessionId(sessionId, updatedCartItems, locale);
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

export async function listIngredientTypes() {
    return ingredientRepo.getIngredientTypes();
}

export async function createIngredient(payload = {}, locale) {
    const name = String(payload?.name ?? "").trim();
    const price = Number(payload?.price);
    const ingredientTypeId = Number(payload?.ingredient_type_id);

    if (!name) {
        throw createHttpError(400, t(locale, 'combo', 'ingredient_name_required'));
    }

    if (Number.isNaN(price) || price < 0) {
        throw createHttpError(400, t(locale, 'combo', 'valid_ingredient_price_required'));
    }

    if (!Number.isInteger(ingredientTypeId) || ingredientTypeId <= 0) {
        throw createHttpError(400, t(locale, 'combo', 'valid_ingredient_type_id_required'));
    }

    const ingredientId = await ingredientRepo.createIngredient({
        name,
        price,
        ingredient_type_id: ingredientTypeId,
    });

    return ingredientRepo.getIngredientById(ingredientId);
}

export async function updateIngredient(ingredientId, payload = {}, locale) {
    if (!Number.isInteger(ingredientId) || ingredientId <= 0) {
        throw createHttpError(400, t(locale, 'combo', 'valid_ingredient_id_required'));
    }

    const updates = {};

	if (payload.is_available !== undefined) {

    	updates.is_available = Boolean(payload.is_available);
	}

    if (payload.name !== undefined) {
        const name = String(payload.name).trim();
        if (!name) {
            throw createHttpError(400, t(locale, 'combo', 'ingredient_name_empty'));
        }
        updates.name = name;
    }

    if (payload.price !== undefined) {
        const price = Number(payload.price);
        if (Number.isNaN(price) || price < 0) {
            throw createHttpError(400, t(locale, 'combo', 'valid_ingredient_price_required'));
        }
        updates.price = price;
    }

    if (payload.ingredient_type_id !== undefined) {
        const ingredientTypeId = Number(payload.ingredient_type_id);
        if (!Number.isInteger(ingredientTypeId) || ingredientTypeId <= 0) {
            throw createHttpError(400, t(locale, 'combo', 'valid_ingredient_type_id_required'));
        }
        updates.ingredient_type_id = ingredientTypeId;
    }

    if (Object.keys(updates).length === 0) {
        throw createHttpError(400, t(locale, 'combo', 'no_update_fields'));
    }

    const isUpdated = await ingredientRepo.updateIngredientById(ingredientId, updates);

    if (!isUpdated) {
        throw createHttpError(404, t(locale, 'combo', 'ingredient_not_found'));
    }

    return ingredientRepo.getIngredientById(ingredientId);
}

export async function deleteIngredient(ingredientId, locale) {
    if (!Number.isInteger(ingredientId) || ingredientId <= 0) {
        throw createHttpError(400, t(locale, 'combo', 'valid_ingredient_id_required'));
    }

    const isDeleted = await ingredientRepo.deleteIngredientById(ingredientId);

    if (!isDeleted) {
        throw createHttpError(404, t(locale, 'combo', 'ingredient_not_found'));
    }

    return true;
}
