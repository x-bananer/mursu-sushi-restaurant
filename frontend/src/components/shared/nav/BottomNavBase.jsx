import { Link } from "react-router";
import "./nav.css";

export default function BottomNavBase({ items }) {
	return (
		<nav className="bottom-nav">
			<div className="bottom-nav__container layout">
				{items.map((item, i) =>
					item.onClick ? (
						<button
							key={i}
							onClick={item.onClick}
							className="bottom-nav__link"
						>
							{item.icon}
						</button>
					) : (
						<Link
							key={i}
							to={item.to}
							className={`bottom-nav__link${item.isActive ? " bottom-nav__link--active" : ""}`}
						>
							{item.icon}
						</Link>
					),
				)}
			</div>
		</nav>
	);
}
