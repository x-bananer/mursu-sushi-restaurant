import { Link, useLocation } from "react-router";
import { sidebarItems } from "./admSideNav";
import "../../shared/nav/nav.css";

const bottomItems = [
  sidebarItems[0], // Dashboard
  sidebarItems[1], // Live Orders
  sidebarItems[2], // Menu Editor
  sidebarItems[4], // Customers
  sidebarItems[6], // Settings
];

export default function AdminBottomNav() {
  const location = useLocation();

  return (
    <nav className="admin-bottom-nav">
      {bottomItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`admin-bottom-nav__item${location.pathname === item.to ? " admin-bottom-nav__item--active" : ""}`}
        >
          {item.icon}
        </Link>
      ))}
    </nav>
  );
}
