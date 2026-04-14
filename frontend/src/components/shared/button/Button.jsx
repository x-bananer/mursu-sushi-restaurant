import "./button.css";

// Props:
// default: dark button
// size: "xsmall", "small", "large"
// variant: "dark", "light", "gray", "accent", "link"
export default function Button({
	variant,
	size,
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

	return (
		<button className={classes} type={type} {...props}>
			{children}
		</button>
	);
}
