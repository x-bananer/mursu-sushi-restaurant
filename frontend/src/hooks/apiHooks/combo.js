import { useEffect, useState } from "react";
import { fetchData } from "../../utils/fetchData";

const useComboIngredients = ({ onlyAvailable = true } = {}) => {
	const [ingredients, setIngredients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadIngredients = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetchData("/dishes/combo/ingredients");
				const allIngredients = response?.ingredients ?? [];
				if (onlyAvailable) {
					const availableIngredients = allIngredients.filter(
						(ingredient) => {
							return Boolean(ingredient?.is_available);
						},
					);
					setIngredients(availableIngredients);
					return;
				}

				setIngredients(allIngredients);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadIngredients();
	}, [onlyAvailable]);

	return { ingredients, loading, error };
};

const useComboPreview = (ingredientsForPreview) => {
	const [combo, setCombo] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const previewKey = JSON.stringify(ingredientsForPreview ?? []);

	useEffect(() => {
		const loadPreview = async () => {
			if (!ingredientsForPreview?.length) {
				setCombo(null);
				setError(null);
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				const response = await fetchData("/dishes/combo/preview", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						ingredients: ingredientsForPreview,
					}),
				});

				setCombo(response.combo ?? null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadPreview();
	}, [previewKey]);

	return { combo, loading, error };
};

export { useComboIngredients, useComboPreview };
