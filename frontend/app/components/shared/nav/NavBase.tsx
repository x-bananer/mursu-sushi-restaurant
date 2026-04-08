import { Link } from "react-router";
import "./nav.css";

type NavItem = {
  to?: string;
  content: React.ReactNode;
  isActive?: boolean;
  isIcon?: boolean;
  onClick?: () => void;
};

type Props = {
  left?: NavItem[];
  center: React.ReactNode;
  right?: NavItem[];
  extraRight?: React.ReactNode;
};

export default function NavBase({ left = [], center, right = [], extraRight }: Props) {
  return (
    <nav className="nav layout">
      <div className="nav__left">
        {left.map((item, i) =>
          item.onClick ? (
            <button
              key={i}
              onClick={item.onClick}
              className={`nav__link${item.isActive ? " nav__link--active" : ""}`}
            >
              {item.content}
            </button>
          ) : (
            <Link
              key={i}
              to={item.to!}
              className={`nav__link${item.isActive ? " nav__link--active" : ""}`}
            >
              {item.content}
            </Link>
          )
        )}
      </div>

      <div className="nav__center">{center}</div>

      <div className="nav__right">
        {extraRight}
        {right.map((item, i) =>
          item.onClick ? (
            <button
              key={i}
              onClick={item.onClick}
              className={`nav__link${item.isIcon ? " nav__icon-link" : ""}`}
            >
              {item.content}
            </button>
          ) : (
            <Link
              key={i}
              to={item.to!}
              className={`nav__link${item.isIcon ? " nav__icon-link" : ""}`}
            >
              {item.content}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}