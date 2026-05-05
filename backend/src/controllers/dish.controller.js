import { placeholder } from "../utils/paceholder.js";
import * as dishService from "../services/dish/dish.service.js";

export async function list(req, res) {
	try {
		const dishes = await dishService.getDishes();

		res.json({ dishes });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" });
	}
}

export async function specials(req, res) {
	try {
		const dish = await dishService.getDailySpecial();

		res.json({ dish });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" });
	}
}

export async function get(req, res) {
	const dishId = 6;

	try {
		const dish = await dishService.getDish(dishId);

		res.json({ dish });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" });
	}
}

export async function listFavorites(req, res) {
	try {
		const userId = Number(req.user?.id);
		if (!Number.isInteger(userId)) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const favorites = await dishService.getUserFavorites(userId);
		res.json({ favorites });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" });
	}
}
export const addFavorite = placeholder("dishes.addFavorite");
export const removeFavorite = placeholder("dishes.removeFavorite");

/* ADM only */
export const createDish = placeholder("adm.createDish");
export const updateDish = placeholder("adm.updateDish");
export const deleteDish = placeholder("adm.deleteDish");

export const createDailySpecial = placeholder("adm.createDailySpecial");
export const deleteDailySpecial = placeholder("adm.deleteDailySpecial");
export const updateDailySpecial = placeholder("adm.updateDailySpecial");
