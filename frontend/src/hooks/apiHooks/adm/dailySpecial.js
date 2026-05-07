import { useState } from "react";
import { fetchData } from "../../../utils/fetchData";

/**
 * ADM API CALLS
 */

export function useSaveDailySpecial() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const save = async (dishId, valid_on) => {
		try {
			setLoading(true);
			setError(null);

			return await fetchData(`/adm/dishes/${dishId}/special`, {
				method: "POST",
				body: JSON.stringify({ valid_on }),
			});
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { save, loading, error };
}

export function useListDailySpecials() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const list = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetchData("/adm/dishes/specials", {
				method: "GET",
			});

			return response?.specials ?? [];
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { list, loading, error };
}

export function useUpdateDailySpecial() {
	const [loading, setLoading] = useState(false);

	const update = async (dishId, valid_on) => {
		setLoading(true);
		try {
			return await fetchData(`/adm/dishes/${dishId}/special`, {
				method: "PATCH",
				body: JSON.stringify({ valid_on }),
			});
		} finally {
			setLoading(false);
		}
	};

	return { update, loading };
}

export function useDeleteDailySpecial() {
	const [loading, setLoading] = useState(false);

	const remove = async (dishId) => {
		setLoading(true);
		try {
			return await fetchData(`/adm/dishes/${dishId}/special`, {
				method: "DELETE",
			});
		} finally {
			setLoading(false);
		}
	};

	return { remove, loading };
}
