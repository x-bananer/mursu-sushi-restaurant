import * as dishService from "../services/dish/dish.service.js";

/**
 * @api {get} /api/v1/dishes List dishes
 * @apiName ListDishes
 * @apiGroup Dishes
 * @apiSuccess {Object[]} dishes Dishes list.
 */
export async function list(req, res, next) {
	try {
		const dishes = await dishService.getDishes();
		res.json({ dishes });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/dishes/daily-special Get daily special
 * @apiName GetDailySpecial
 * @apiGroup Dishes
 * @apiSuccess {Object[]} dish Daily special entries.
 */
export async function specials(req, res, next) {
	try {
		const dish = await dishService.getDailySpecial();
		res.json({ dish });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/dishes/categories List categories
 * @apiName ListDishCategories
 * @apiGroup Dishes
 * @apiSuccess {Object[]} categories Categories list.
 */
export async function categories(req, res, next) {
	try {
		const categories = await dishService.getDishCategories();
		res.json({ categories });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {post} /api/v1/adm/dishes/categories Create category
 * @apiName CreateDishCategory
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiSuccess (201) {Object} category Created category.
 */
export async function createCategory(req, res, next) {
	try {
		const category = await dishService.createDishCategory(req.body || {}, req.locale);
		return res.status(201).json({ category });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {patch} /api/v1/adm/dishes/categories/:id Update category
 * @apiName UpdateDishCategory
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Category id.
 * @apiSuccess {Object} category Updated category.
 */
export async function updateCategory(req, res, next) {
	try {
		const categoryId = Number(req.params.id);
		const category = await dishService.updateDishCategory(categoryId, req.body || {}, req.locale);
		return res.json({ category });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {delete} /api/v1/adm/dishes/categories/:id Delete category
 * @apiName DeleteDishCategory
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Category id.
 * @apiSuccess (204) NoContent Deleted.
 */
export async function deleteCategory(req, res, next) {
	try {
		const categoryId = Number(req.params.id);
		await dishService.deleteDishCategory(categoryId, req.locale);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/dishes/:dish_id Get dish by id
 * @apiName GetDishById
 * @apiGroup Dishes
 * @apiParam {Number} dish_id Dish id.
 * @apiSuccess {Object[]} dish Dish payload.
 */
export async function get(req, res, next) {
	try {
		const dishId = Number(req.params.dish_id);
		const dish = await dishService.getDish(dishId, req.locale);
		res.json({ dish });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/dishes/favorites List favorites
 * @apiName ListFavorites
 * @apiGroup Dishes
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiSuccess {Object[]} favorites Favorites list.
 */
export async function listFavorites(req, res, next) {
	try {
		const userId = Number(req.user?.id);
		const favorites = await dishService.getUserFavorites(userId);
		res.json({ favorites });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {post} /api/v1/dishes/:dish_id/favorite Add favorite
 * @apiName AddFavorite
 * @apiGroup Dishes
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiParam {Number} dish_id Dish id.
 * @apiSuccess (204) NoContent Added.
 */
export async function addFavorite(req, res, next) {
	try {
		const userId = Number(req.user?.id);
		const dishId = Number(req.params.dish_id);
		await dishService.addFavorite(userId, dishId, req.locale);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}

/**
 * @api {delete} /api/v1/dishes/:dish_id/favorite Remove favorite
 * @apiName RemoveFavorite
 * @apiGroup Dishes
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiParam {Number} dish_id Dish id.
 * @apiSuccess (204) NoContent Removed.
 */
export async function removeFavorite(req, res, next) {
	try {
		const userId = Number(req.user?.id);
		const dishId = Number(req.params.dish_id);
		await dishService.removeFavorite(userId, dishId, req.locale);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}

/**
 * @api {post} /api/v1/adm/dishes Create dish
 * @apiName CreateDish
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiSuccess (201) {Object} dish Created dish.
 */
export async function createDish(req, res, next) {
	try {
		const dish = await dishService.createDish(req.body || {}, req.locale);
		return res.status(201).json({ dish });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {patch} /api/v1/adm/dishes/:id Update dish
 * @apiName UpdateDish
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Dish id.
 * @apiSuccess {Object} dish Updated dish.
 */
export async function updateDish(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		const dish = await dishService.updateDish(dishId, req.body || {}, req.locale);
		return res.json({ dish });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {delete} /api/v1/adm/dishes/:id Delete dish
 * @apiName DeleteDish
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Dish id.
 * @apiSuccess (204) NoContent Deleted.
 */
export async function deleteDish(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		await dishService.deleteDish(dishId, req.locale);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}

/**
 * @api {post} /api/v1/adm/dishes/:id/special Create daily special
 * @apiName CreateDailySpecial
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Dish id.
 * @apiSuccess (201) {Object} special Created special.
 */
export async function createDailySpecial(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		const special = await dishService.createDailySpecial(dishId, req.body || {}, req.locale);
		return res.status(201).json({ special });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {patch} /api/v1/adm/dishes/:id/special Update daily special
 * @apiName UpdateDailySpecial
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Dish id.
 * @apiSuccess {Object} special Updated special.
 */
export async function updateDailySpecial(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		const special = await dishService.updateDailySpecial(dishId, req.body || {}, req.locale);
		return res.json({ special });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {delete} /api/v1/adm/dishes/:id/special Delete daily special
 * @apiName DeleteDailySpecial
 * @apiGroup DishesAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} id Dish id.
 * @apiSuccess (204) NoContent Deleted.
 */
export async function deleteDailySpecial(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		await dishService.deleteDailySpecial(dishId, req.locale);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}
