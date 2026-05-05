import "./button.css";

// Props:
// default: dark button
// size: "xsmall", "small", "large"
// variant: "dark", "light", "gray", "accent", "link"
export default function Button({
	variant,
	size,
	disabled = false,
	className = "",
	type = "button",
	children,
	...props
}) {
	let classes = "btn";

	if (size) {
		classes += ` btn--${size}`;
	}

	if (variant) {
		classes += ` btn--${variant}`;
	}

	if (className) {
		classes += ` ${className}`;
	}

	if (disabled) {
		classes += " btn--disabled";
	}

	return (
		<button className={classes} type={type} disabled={disabled} {...props}>
			{children}
		</button>
	);
}
