import { Link, useLocation } from "react-router";
import {DashboardIcon, LiveOrdersIcon, MenuEditorIcon, DailySpecialIcon, CustomersIcon, ReviewsIcon, SettingsIcon} from "../../shared/nav/icons";
import "../../shared/nav/nav.css";

const bottomItems = [
  {
      to: "/adm",
      label: "Dashboard",
      icon: <DashboardIcon className="admin-nav__icon" />,
    },
    {
      to: "/adm/orders",
      label: "Live Orders",
      icon: <LiveOrdersIcon className="admin-nav__icon" />,
    },
    {
      to: "/adm/menu",
      label: "Menu Editor",
      icon: <MenuEditorIcon className="admin-nav__icon" />,
    },
    {
      to: "/adm/special",
      label: "Daily Special",
      icon: <DailySpecialIcon className="admin-nav__icon" />,
    },
    {
      to: "/adm/customers",
      label: "Customers",
      icon: <CustomersIcon className="admin-nav__icon" />,
    },
    {
      to: "/adm/reviews",
      label: "Reviews",
      icon: <ReviewsIcon className="admin-nav__icon" />,
    },
    {
      to: "/adm/settings",
      label: "Settings",
      icon: <SettingsIcon className="admin-nav__icon" />,
    },
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
