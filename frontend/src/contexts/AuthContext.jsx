import { createContext, useContext, useState, useEffect } from "react";
import { fetchData } from "../utils/fetchData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("user");
		return saved ? JSON.parse(saved) : null;
	});

	const [token, setToken] = useState(() => localStorage.getItem("token"));
	const [isLoading, setIsLoading] = useState(!!token);

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

	return (
		<AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
