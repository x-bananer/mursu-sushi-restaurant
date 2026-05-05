import { useState } from "react";
import { fetchData } from "../../utils/fetchData";

export function useLogin() {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const login = async (credentials) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetchData("/auth/login", {
				method: "POST",
				body: JSON.stringify(credentials),
			});

			const { user, token } = response;

			setUser(user);
			setToken(token);

			if (token) {
				localStorage.setItem("token", token);
			}

			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { login, user, token, loading, error };
}

export function useRegisterUser() {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const register = async (userData) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetchData("/auth/register", {
				method: "POST",
				body: JSON.stringify(userData),
			});

			const { user, token } = response;

			setUser(user);
			setToken(token);

			if (token) {
				localStorage.setItem("token", token);
			}

			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { register, user, token, loading, error };
}
