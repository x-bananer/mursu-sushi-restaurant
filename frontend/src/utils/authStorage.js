export function saveAuth({ token, user }) {
	if (token) {
		localStorage.setItem("token", token);
	}

	if (user) {
		localStorage.setItem("user", JSON.stringify(user));
	}
}

export function clearAuth() {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
}
