import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("user");
		return saved ? JSON.parse(saved) : null;
	});

	const [token, setToken] = useState(() => localStorage.getItem("token"));

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
		<AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
