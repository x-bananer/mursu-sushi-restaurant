import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchData } from "../utils/fetchData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		try {
			const saved = localStorage.getItem("user");
			return saved ? JSON.parse(saved) : null;
		} catch (err) {
			console.error("Failed to parse user from localStorage:", err);
			return null;
		}
	});

	const [token, setToken] = useState(() => localStorage.getItem("token"));
	const [isLoading, setIsLoading] = useState(!!token);

	const login = (userData, userToken) => {
		setUser(userData);
		setToken(userToken);
		localStorage.setItem("user", JSON.stringify(userData));
		localStorage.setItem("token", userToken);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	const updateUser = (userData) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	useEffect(() => {
		async function refreshAuth() {
			if (!token) {
				setIsLoading(false);
				return;
			}

			try {
				const data = await fetchData("/auth/refresh", { method: "POST" });
				if (data?.user && data?.token) {
					login(data.user, data.token);
				} else {
					logout();
				}
			} catch (err) {
				console.error("Auth refresh failed:", err);
				logout();
			} finally {
				setIsLoading(false);
			}
		}

		refreshAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const value = useMemo(() => ({
		user,
		token,
		isLoading,
		login,
		logout,
		updateUser,
		isAdmin: user?.role_id === 2
	}), [user, token, isLoading]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
