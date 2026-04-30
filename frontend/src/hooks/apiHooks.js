import { useEffect, useState } from 'react';
import { fetchData } from '../utils/fetchData';

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

export { useComboIngredients };
