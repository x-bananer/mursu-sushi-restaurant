import * as comboService from '../services/dish/combo.service.js';

/**
 * POST /dishes/combo/preview
 * Validate combo ingredients and return calculated combo preview.
 */
export async function previewCombo(req, res, next) {
    try {
        const { ingredients } = req.body;
        const combo = await comboService.previewCombo(ingredients, false, req.locale);
        return res.json({ combo });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /dishes/combo/create
 * Create combo item from ingredients and add it to cart by session id.
 */
export async function createCombo(req, res, next) {
    try {
        const sessionId = String(req.headers['x-session-id'] || '').trim();
        const { ingredients } = req.body;

        const cart = await comboService.createCombo(sessionId, ingredients, req.locale);
        return res.json({ cart });
    } catch (err) {
        next(err);
    }
}

export async function listComboIngredients(req, res, next) {
   try {
        const ingredients = await comboService.listComboIngredients();
        return res.json({ ingredients });
    } catch (err) {
        next(err);
    }
}

export async function listIngredientTypes(req, res, next) {
   try {
        const ingredientTypes = await comboService.listIngredientTypes();
        return res.json({ ingredientTypes });
    } catch (err) {
        next(err);
    }
}

/* ADM only */
export async function createIngredient(req, res, next) {
    try {
        const ingredient = await comboService.createIngredient(req.body || {}, req.locale);
        return res.status(201).json({ ingredient });
    } catch (err) {
        next(err);
    }
}

export async function updateIngredient(req, res, next) {
    try {
        const ingredientId = Number(req.params.id);
        const ingredient = await comboService.updateIngredient(ingredientId, req.body || {}, req.locale);
        return res.json({ ingredient });
    } catch (err) {
        next(err);
    }
}

export async function deleteIngredient(req, res, next) {
    try {
        const ingredientId = Number(req.params.id);
        await comboService.deleteIngredient(ingredientId, req.locale);
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
}
