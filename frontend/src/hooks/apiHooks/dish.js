import { useEffect, useState } from "react";
import { fetchData } from "../../utils/fetchData";

export function useDishes() {
	const [dishes, setDishes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadDishes = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetchData("/dishes");
				setDishes(response?.dishes ?? []);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadDishes();
	}, []);

	return { dishes, loading, error };
}

export function useDishCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadCategories = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetchData("/dishes/categories");
				setCategories(response?.categories ?? []);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadCategories();
	}, []);

	return { categories, loading, error };
}

export function useDailySpecial() {
	const [specialDish, setSpecialDish] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadSpecial = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetchData("/dishes/daily-special");
				setSpecialDish(response?.dish?.[0] ?? null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadSpecial();
	}, []);

	return { specialDish, loading, error };
}

export function useDishFavorites() {
	const [favoriteDishIds, setFavoriteDishIds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pendingDishIds, setPendingDishIds] = useState([]);

	useEffect(() => {
		const loadFavorites = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setFavoriteDishIds([]);
				setLoading(false);
				setError(null);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				const response = await fetchData("/dishes/favorites");
				const ids = (response?.favorites || []).map((dish) => dish.id);
				setFavoriteDishIds(ids);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadFavorites();
	}, []);

	const toggleFavorite = async (dishId) => {
		const isFavorite = favoriteDishIds.includes(dishId);

		try {
			setPendingDishIds((prev) => [...prev, dishId]);
			setError(null);

			if (isFavorite) {
				await fetchData(`/dishes/${dishId}/favorite`, {
					method: "DELETE",
				});
				setFavoriteDishIds((prev) =>
					prev.filter((id) => id !== dishId),
				);
				return { message: "Removed from favorites" };
			}

			await fetchData(`/dishes/${dishId}/favorite`, { method: "POST" });
			setFavoriteDishIds((prev) => [...prev, dishId]);
			return { message: "Added to favorites" };
		} catch (err) {
			return { message: err.message || "Failed to update favorites" };
		} finally {
			setPendingDishIds((prev) => prev.filter((id) => id !== dishId));
		}
	};

	return {
		favoriteDishIds,
		toggleFavorite,
		pendingDishIds,
		loading,
		error,
	};
}
