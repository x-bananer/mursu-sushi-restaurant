import "./badge.css";

// Props:
// default: light badge
// variant: "dark"
export default function Badge({ variant, className = "", children, ...props }) {
  let classes = "badge";

  if (variant) {
    classes += ` badge--${variant}`;
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
