import "./button-counter.css";

// Props:
// default: dark counter
// variant: "light"
export default function ButtonCounter({
	value = 1,
	variant = "",
	onMinus,
	onPlus,
}) {
	let classes = "btn-counter";

	if (variant) {
		classes += ` btn-counter--${variant}`;
	}

	return (
		<div className={classes}>
			<button
				className="btn-counter__btn"
				type="button"
				onClick={onMinus}
			>
				−
			</button>
			<span className="btn-counter__value">{value}</span>
			<button className="btn-counter__btn" type="button" onClick={onPlus}>
				+
			</button>
		</div>
	);
}
