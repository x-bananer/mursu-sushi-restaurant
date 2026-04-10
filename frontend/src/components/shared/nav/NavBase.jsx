import { Link } from "react-router";
import "./nav.css";

export default function NavBase({ left = [], center, right = [], extraRight }) {
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
              to={item.to}
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
              to={item.to}
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
