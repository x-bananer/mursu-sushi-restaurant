import * as dishRepo from "../../models/db/repositories/dish/dish.repository.js";
import * as dailySpecialRepo from "../../models/db/repositories/dish/dailySpecial.repository.js";
import * as userFavoriteRepo from "../../models/db/repositories/dish/favorite.repository.js";
import { t } from "../../i18n/messages.js";

function createHttpError(statusCode, message) {
	const error = /** @type {Error & { statusCode: number }} */ (new Error(message));
	error.statusCode = statusCode;
	return error;
}

function normalizeBadges(databaseBadges) {
	let badges = [];

	if (Array.isArray(databaseBadges)) {
		badges = databaseBadges;
	} else if (typeof databaseBadges === "string") {
		try {
			const parsed = JSON.parse(databaseBadges || "[]");
			badges = Array.isArray(parsed) ? parsed : [];
		} catch {
			badges = [];
		}
	}

	return badges.filter((badge) => badge && typeof badge === "object" && badge.id != null && badge.name != null);
}

export async function getDishes() {
	const dishes = await dishRepo.getDishes();

	return dishes.map((d) => {
		return {
			...d,
			price: Number(d.price),
			is_available: Boolean(d.is_available),
			badges: normalizeBadges(d.badges),
		};
	});
}

export async function getDishCategories() {
	return dishRepo.getDishCategories();
}

export async function createDishCategory(payload = {}, locale) {
	const name = String(payload.name || "").trim();
	const sortOrder = payload.sort_order === undefined ? 0 : Number(payload.sort_order);

	if (!name) {
		throw createHttpError(400, t(locale, "dish", "category_name_required"));
	}
	if (!Number.isInteger(sortOrder)) {
		throw createHttpError(400, t(locale, "dish", "sort_order_integer"));
	}

	const categoryId = await dishRepo.createDishCategory({ name, sort_order: sortOrder });
	return dishRepo.getDishCategoryById(categoryId);
}

export async function updateDishCategory(categoryId, payload = {}, locale) {
	if (!Number.isInteger(categoryId) || categoryId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_category_id_required"));
	}

	const updates = {};

	if (payload.name !== undefined) {
		const name = String(payload.name).trim();
		if (!name) {
			throw createHttpError(400, t(locale, "dish", "category_name_empty"));
		}
		updates.name = name;
	}

	if (payload.sort_order !== undefined) {
		const sortOrder = Number(payload.sort_order);
		if (!Number.isInteger(sortOrder)) {
			throw createHttpError(400, t(locale, "dish", "sort_order_integer"));
		}
		updates.sort_order = sortOrder;
	}

	if (!Object.keys(updates).length) {
		throw createHttpError(400, t(locale, "dish", "no_update_fields"));
	}

	const updatedFields = await dishRepo.updateDishCategoryById(categoryId, updates);
	if (updatedFields === 0) {
		throw createHttpError(404, t(locale, "dish", "category_not_found"));
	}

	return dishRepo.getDishCategoryById(categoryId);
}

export async function deleteDishCategory(categoryId, locale) {
	if (!Number.isInteger(categoryId) || categoryId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_category_id_required"));
	}

	const deletedFields = await dishRepo.deleteDishCategoryById(categoryId);
	if (deletedFields === 0) {
		throw createHttpError(404, t(locale, "dish", "category_not_found"));
	}

	return true;
}

export async function getDish(dishId, locale) {
	if (!Number.isInteger(dishId) || dishId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_id_required"));
	}

	const dish = await dishRepo.getDish(dishId);
	if (!dish.length) {
		throw createHttpError(404, t(locale, "dish", "dish_not_found"));
	}

	return dish.map((d) => {
		return {
			...d,
			price: Number(d.price),
			is_available: Boolean(d.is_available),
			badges: normalizeBadges(d.badges),
		};
	});
}

export async function getDailySpecial() {
	const special = await dailySpecialRepo.getDailySpecial();

	return special.map((d) => {
		return {
			...d,
			price: Number(d.price),
			is_available: Boolean(d.is_available),
			badges: normalizeBadges(d.badges),
		};
	});
}

export async function getUserFavorites(userId) {
	const favorites = await userFavoriteRepo.getUserFavorites(userId);

	return favorites.map((d) => {
		return {
			...d,
			price: Number(d.price),
			is_available: Boolean(d.is_available),
			badges: normalizeBadges(d.badges),
		};
	});
}

export async function addFavorite(userId, dishId, locale) {
	if (!Number.isInteger(dishId) || dishId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_id_required"));
	}

	try {
		await userFavoriteRepo.addFavorite(userId, dishId);
	} catch (err) {
		if (err && err.code === "ER_DUP_ENTRY") {
			throw createHttpError(409, t(locale, "dish", "dish_already_favorite"));
		}
		if (err && err.code === "ER_NO_REFERENCED_ROW_2") {
			throw createHttpError(400, t(locale, "dish", "favorite_fk_missing"));
		}
		throw err;
	}

	return true;
}

export async function removeFavorite(userId, dishId, locale) {
	if (!Number.isInteger(userId) || userId <= 0) {
		throw createHttpError(401, t(locale, "dish", "unauthorized"));
	}

	if (!Number.isInteger(dishId) || dishId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_id_required"));
	}

	await userFavoriteRepo.removeFavorite(userId, dishId);
	return true;
}

export async function createDish(payload = {}, locale) {
	const body = payload || {};
	const name = String(body.name || "").trim();
	const description = body.description ? String(body.description).trim() : null;
	const price = Number(body.price);
	const isAvailable = body.is_available ?? true;
	const categoryId = body.category_id == null ? null : Number(body.category_id);

	if (!name) {
		throw createHttpError(400, t(locale, "dish", "dish_name_required"));
	}
	if (Number.isNaN(price) || price < 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_price_required"));
	}
	if (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0)) {
		throw createHttpError(400, t(locale, "dish", "valid_category_id_payload_required"));
	}

	const dishId = await dishRepo.createDish({
		name,
		category_id: categoryId,
		description,
		price,
		is_available: isAvailable === true || isAvailable === 1,
	});

	const dish = await dishRepo.getDish(dishId);
	return dish[0];
}

export async function updateDish(dishId, payload = {}, locale) {
	if (!Number.isInteger(dishId) || dishId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_id_required"));
	}

	const updates = {};

	if (payload.name !== undefined) {
		const name = String(payload.name).trim();
		if (!name) {
			throw createHttpError(400, t(locale, "dish", "dish_name_empty"));
		}
		updates.name = name;
	}

	if (payload.description !== undefined) {
		updates.description = payload.description == null ? null : String(payload.description).trim();
	}

	if (payload.price !== undefined) {
		const price = Number(payload.price);
		if (Number.isNaN(price) || price < 0) {
			throw createHttpError(400, t(locale, "dish", "valid_dish_price_required"));
		}
		updates.price = price;
	}

	if (payload.is_available !== undefined) {
		updates.is_available = payload.is_available === true || payload.is_available === 1;
	}

	if (payload.category_id !== undefined) {
		if (payload.category_id === null) {
			updates.category_id = null;
		} else {
			const categoryId = Number(payload.category_id);
			if (!Number.isInteger(categoryId) || categoryId <= 0) {
				throw createHttpError(400, t(locale, "dish", "valid_category_id_payload_required"));
			}
			updates.category_id = categoryId;
		}
	}

	if (!Object.keys(updates).length) {
		throw createHttpError(400, t(locale, "dish", "no_update_fields"));
	}

	const updatedFields = await dishRepo.updateDishById(dishId, updates);
	if (updatedFields === 0) {
		throw createHttpError(404, t(locale, "dish", "dish_not_found"));
	}

	const dish = await dishRepo.getDish(dishId);
	return dish[0];
}

export async function deleteDish(dishId, locale) {
	if (!Number.isInteger(dishId) || dishId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_id_required"));
	}

	const deletedFields = await dishRepo.deleteDishById(dishId);
	if (deletedFields === 0) {
		throw createHttpError(404, t(locale, "dish", "dish_not_found"));
	}

	return true;
}

export async function createDailySpecial(dishId, payload = {}, locale) {
	if (!Number.isInteger(dishId) || dishId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_id_required"));
	}

	const validOn = String(payload?.valid_on ?? "").trim();
	if (!validOn) {
		throw createHttpError(400, t(locale, "dish", "valid_on_required"));
	}

	const specialId = await dailySpecialRepo.createDailySpecial({ dishId, validOn });
	return dailySpecialRepo.getDailySpecialById(specialId);
}

export async function updateDailySpecial(dishId, payload = {}, locale) {
	if (!Number.isInteger(dishId) || dishId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_id_required"));
	}

	const validOn = String(payload?.valid_on ?? "").trim();
	if (!validOn) {
		throw createHttpError(400, t(locale, "dish", "valid_on_required"));
	}

	const updatedFields = await dailySpecialRepo.updateDailySpecialByDishId(dishId, validOn);
	if (updatedFields === 0) {
		throw createHttpError(404, t(locale, "dish", "daily_special_not_found"));
	}

	return { dish_id: dishId, valid_on: validOn };
}

export async function deleteDailySpecial(dishId, locale) {
	if (!Number.isInteger(dishId) || dishId <= 0) {
		throw createHttpError(400, t(locale, "dish", "valid_dish_id_required"));
	}

	const deletedFields = await dailySpecialRepo.deleteDailySpecialByDishId(dishId);
	if (deletedFields === 0) {
		throw createHttpError(404, t(locale, "dish", "daily_special_not_found"));
	}

	return true;
}
