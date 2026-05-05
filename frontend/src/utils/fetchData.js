const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchData = async (url, options = {}) => {
	const sessionId = localStorage.getItem("session_id");

	const headers = {
		...(options.headers || {}),
	};

	if (sessionId) {
		headers["x-session-id"] = sessionId;
	}

	const response = await fetch(`${API_BASE_URL}${url}`, {
		...options,
		headers,
	});
	const json = await response.json();

	if (!response.ok) {
		if (json.message) {
			throw new Error(json.message);
		}

		throw new Error(`Error ${response.status} occurred`);
	}

	return json;
};

export { fetchData };
