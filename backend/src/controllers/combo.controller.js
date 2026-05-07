import * as comboService from '../services/dish/combo.service.js';

/**
 * @api {post} /api/v1/dishes/combo/preview Preview combo
 * @apiName PreviewCombo
 * @apiGroup Combo
 * @apiBody {Object[]} ingredients Ingredient rows.
 * @apiSuccess {Object} combo Combo with `ingredients` and `total_price`.
 * @apiError (400) BadRequest Invalid combo payload/order.
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
 * @api {post} /api/v1/dishes/combo/create Create combo
 * @apiName CreateCombo
 * @apiGroup Combo
 * @apiHeader {String} x-session-id Session id.
 * @apiBody {Object[]} ingredients Ingredient rows.
 * @apiSuccess {Object} cart Updated cart DTO.
 * @apiError (400) BadRequest Missing session id or invalid combo.
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

/**
 * @api {get} /api/v1/dishes/combo/ingredients List combo ingredients
 * @apiName ListComboIngredients
 * @apiGroup Combo
 * @apiSuccess {Object[]} ingredients Ingredient list.
 */
export async function listComboIngredients(req, res, next) {
	try {
		const ingredients = await comboService.listComboIngredients();
		return res.json({ ingredients });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/dishes/combo/ingredients/types List combo ingredient types
 * @apiName ListComboIngredientTypes
 * @apiGroup Combo
 * @apiSuccess {Object[]} ingredientTypes Ingredient type list.
 */
export async function listIngredientTypes(req, res, next) {
	try {
		const ingredientTypes = await comboService.listIngredientTypes();
		return res.json({ ingredientTypes });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {post} /api/v1/adm/ingredients Create ingredient
 * @apiName CreateIngredient
 * @apiGroup ComboAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiBody {String} name Ingredient name.
 * @apiBody {Number} price Ingredient price.
 * @apiBody {Number} ingredient_type_id Ingredient type id.
 * @apiSuccess (201) {Object} ingredient Created ingredient.
 */
export async function createIngredient(req, res, next) {
	try {
		const ingredient = await comboService.createIngredient(req.body || {}, req.locale);
		return res.status(201).json({ ingredient });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {patch} /api/v1/adm/ingredients/:id Update ingredient
 * @apiName UpdateIngredient
 * @apiGroup ComboAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Ingredient id.
 * @apiSuccess {Object} ingredient Updated ingredient.
 */
export async function updateIngredient(req, res, next) {
	try {
		const ingredientId = Number(req.params.id);
		const ingredient = await comboService.updateIngredient(
			ingredientId,
			req.body || {},
			req.locale
		);
		return res.json({ ingredient });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {delete} /api/v1/adm/ingredients/:id Delete ingredient
 * @apiName DeleteIngredient
 * @apiGroup ComboAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Ingredient id.
 * @apiSuccess (204) NoContent Deleted.
 */
export async function deleteIngredient(req, res, next) {
	try {
		const ingredientId = Number(req.params.id);
		await comboService.deleteIngredient(ingredientId, req.locale);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}
