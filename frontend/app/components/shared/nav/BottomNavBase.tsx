import { Link } from "react-router";
import "./nav.css";

type BottomNavItem = {
  to?: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
};

type Props = {
  items: BottomNavItem[];
};

export default function BottomNavBase({ items }: Props) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__container layout">
        {items.map((item, i) =>
          item.onClick ? (
            <button key={i} onClick={item.onClick} className="bottom-nav__link">
              {item.icon}
            </button>
          ) : (
            <Link
              key={i}
              to={item.to!}
              className={`bottom-nav__link${item.isActive ? " bottom-nav__link--active" : ""}`}
            >
              {item.icon}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
