export function debounce(fn, delay = 300) {
	let timeoutId;

	const debounced = (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fn(...args);
		}, delay);
	};

	debounced.cancel = () => {
		clearTimeout(timeoutId);
	};

	return debounced;
}
