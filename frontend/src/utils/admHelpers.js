export function getCurrentWeekDates() {
	const today = new Date();

	const monday = new Date(today);
	const day = monday.getDay();
	const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
	monday.setDate(diff);

	return Array.from({ length: 7 }).map((_, i) => {
		const date = new Date(monday);
		date.setDate(monday.getDate() + i);

		return {
			label: date.toLocaleDateString("en-US", { weekday: "long" }),
			date: date.toISOString().split("T")[0],
		};
	});
}
