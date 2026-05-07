import { useState, useCallback } from "react";
import { fetchData } from "../../utils/fetchData";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Custom hook for user-related API calls and state.
 * Centralizes profile management logic.
 */
export const useUser = () => {
	const { updateUser, logout } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const getProfile = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await fetchData("/users/me");
			if (data && data.user) {
				updateUser(data.user);
				return data.user;
			}
			return null;
		} catch (err) {
			setError(err.message);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, [updateUser]);

	const updateProfile = useCallback(
		async (payload, photoFile = null) => {
			setIsLoading(true);
			setError(null);
			try {
				let data = null;
				if (photoFile) {
					const formData = new FormData();
					Object.keys(payload).forEach((key) => {
						formData.append(key, payload[key]);
					});
					formData.append("photo", photoFile);

					data = await fetchData("/users/me", {
						method: "PATCH",
						body: formData,
					});
				} else {
					data = await fetchData("/users/me", {
						method: "PATCH",
						body: JSON.stringify(payload),
					});
				}

				if (data && data.user) {
					updateUser(data.user);
					return data.user;
				}
				return null;
			} catch (err) {
				setError(err.message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[updateUser],
	);

	const deleteAccount = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			await fetchData("/users/me", { method: "DELETE" });
			logout();
			return true;
		} catch (err) {
			setError(err.message);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [logout]);

	return {
		getProfile,
		updateProfile,
		deleteAccount,
		isLoading,
		error,
		setError,
	};
};
