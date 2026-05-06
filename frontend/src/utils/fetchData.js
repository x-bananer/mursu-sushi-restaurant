const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchData = async (url, options = {}) => {
	const sessionId = localStorage.getItem("session_id");
	const token = localStorage.getItem("token");

	const headers = {
		"Content-Type": "application/json",
		...(options.headers || {}),
	};

	if (sessionId) {
		headers["x-session-id"] = sessionId;
	}

	if (token && !headers.Authorization) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${url}`, {
		...options,
		headers,
	});
	let json = null;
	const isNoContent = response.status === 204;
	if (!isNoContent) {
		const contentType = response.headers.get("content-type") || "";
		if (contentType.includes("application/json")) {
			json = await response.json();
		}
	}

	if (!response.ok) {
		if (json?.message) {
			throw new Error(json.message);
		}

		throw new Error(`Error ${response.status} occurred`);
	}

	return json;
};

export { fetchData };
