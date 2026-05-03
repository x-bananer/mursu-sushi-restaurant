import { placeholder } from '../utils/paceholder.js';
import * as comboService from '../services/dish/combo.service.js';

/**
 * POST /dishes/combo/preview
 * Validate combo ingredients and return calculated combo preview.
 */
export async function previewCombo(req, res, next) {
    try {
        const { ingredients } = req.body;
        const combo = await comboService.previewCombo(ingredients);
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

        const cart = await comboService.createCombo(sessionId, ingredients);
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

/* ADM only */
export const createIngredient = placeholder('adm.createIngredient');
export const updateIngredient = placeholder('adm.updateIngredient');
export const deleteIngredient = placeholder('adm.deleteIngredient');
