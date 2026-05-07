import { useEffect, useState } from "react";

export const useGeolocation = () => {
	const isSupported =
		typeof navigator !== "undefined" && navigator.geolocation;

	const [location, setLocation] = useState({
		lat: null,
		lon: null,
	});
	const [loading, setLoading] = useState(isSupported);
	const [error, setError] = useState(
		isSupported ? null : "Geolocation is not supported",
	);

	useEffect(() => {
		if (!isSupported) return;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation({
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				});
				setLoading(false);
			},
			(err) => {
				setError(err.message);
				setLoading(false);
			},
		);
	}, [isSupported]);

	return { ...location, loading, error };
};
