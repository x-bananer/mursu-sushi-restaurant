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
