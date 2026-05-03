import { useEffect, useState } from 'react';
import { fetchData } from '../../utils/fetchData';

const useComboIngredients = () => {
	const [ingredients, setIngredients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadIngredients = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetchData('/dishes/combo/ingredients');
				setIngredients(response.ingredients ?? []);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadIngredients();
	}, []);

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
				const response = await fetchData('/dishes/combo/preview', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ingredients: ingredientsForPreview }),
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

const useCreateCombo = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const createCombo = async (ingredients, sessionId) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetchData('/dishes/combo/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-session-id': sessionId,
				},
				body: JSON.stringify({ ingredients }),
			});

			return response.cart;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { createCombo, loading, error };
};


export { useComboIngredients, useComboPreview, useCreateCombo };
