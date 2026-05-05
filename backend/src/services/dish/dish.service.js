import * as dishRepo from "../../models/db/repositories/dish/dish.repository.js";
import * as dailySpecialRepo from "../../models/db/repositories/dish/dailySpecial.repository.js";
import * as userFavoriteRepo from "../../models/db/repositories/dish/favorite.repository.js";

export async function getDishes() {
	const dishes = await dishRepo.getDishes();

	return dishes.map((d) => {
		const badges = JSON.parse(d.badges || "[]");

		return {
			...d,
			price: Number(d.price),
			badges: Array.isArray(badges) ? badges : [],
		};
	});
}

export async function getDish(dishId) {
	const dish = await dishRepo.getDish(dishId);

	return dish.map((d) => {
		const badges = JSON.parse(d.badges || "[]");

		return {
			...d,
			price: Number(d.price),
			badges: Array.isArray(badges) ? badges : [],
		};
	});
}

export async function getDailySpecial() {
	const special = await dailySpecialRepo.getDailySpecial();

	return special.map((d) => {
		const badges = JSON.parse(d.badges || "[]");

		return {
			...d,
			price: Number(d.price),
			badges: Array.isArray(badges) ? badges : [],
		};
	});
}

export async function getUserFavorites(userId) {
	const favorites = await userFavoriteRepo.getUserFavorites(userId);

	return favorites.map((d) => {
		const badges = JSON.parse(d.badges || "[]");

		return {
			...d,
			price: Number(d.price),
			badges: Array.isArray(badges) ? badges : [],
		};
	});
}
