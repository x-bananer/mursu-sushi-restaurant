import * as dishService from "../services/dish/dish.service.js";

export async function list(req, res, next) {
	try {
		const dishes = await dishService.getDishes();
		res.json({ dishes });
	} catch (err) {
		next(err);
	}
}

export async function specials(req, res, next) {
	try {
		const dish = await dishService.getDailySpecial();
		res.json({ dish });
	} catch (err) {
		next(err);
	}
}

export async function categories(req, res, next) {
	try {
		const categories = await dishService.getDishCategories();
		res.json({ categories });
	} catch (err) {
		next(err);
	}
}

export async function get(req, res, next) {
	try {
		const dishId = Number(req.params.dish_id);
		const dish = await dishService.getDish(dishId);
		res.json({ dish });
	} catch (err) {
		next(err);
	}
}

export async function listFavorites(req, res, next) {
	try {
		const userId = Number(req.user?.id);
		const favorites = await dishService.getUserFavorites(userId);
		res.json({ favorites });
	} catch (err) {
		next(err);
	}
}

export async function addFavorite(req, res, next) {
	try {
		const userId = Number(req.user?.id);
		const dishId = Number(req.params.dish_id);
		await dishService.addFavorite(userId, dishId);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}

export async function removeFavorite(req, res, next) {
	try {
		const userId = Number(req.user?.id);
		const dishId = Number(req.params.dish_id);
		await dishService.removeFavorite(userId, dishId);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}

/* ADM only */
export async function createDish(req, res, next) {
	try {
		const dish = await dishService.createDish(req.body || {});
		return res.status(201).json({ dish });
	} catch (err) {
		next(err);
	}
}

export async function updateDish(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		const dish = await dishService.updateDish(dishId, req.body || {});
		return res.json({ dish });
	} catch (err) {
		next(err);
	}
}

export async function deleteDish(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		await dishService.deleteDish(dishId);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}

export async function createDailySpecial(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		const special = await dishService.createDailySpecial(dishId, req.body || {});
		return res.status(201).json({ special });
	} catch (err) {
		next(err);
	}
}

export async function updateDailySpecial(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		const special = await dishService.updateDailySpecial(dishId, req.body || {});
		return res.json({ special });
	} catch (err) {
		next(err);
	}
}

export async function deleteDailySpecial(req, res, next) {
	try {
		const dishId = Number(req.params.id);
		await dishService.deleteDailySpecial(dishId);
		return res.status(204).send();
	} catch (err) {
		next(err);
	}
}
