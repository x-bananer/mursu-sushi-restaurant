import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
	DashboardIcon,
	LiveOrdersIcon,
	MenuEditorIcon,
	DailySpecialIcon,
	CustomersIcon,
} from "../../shared/nav/icons";
import "../../shared/nav/nav.css";

export default function AdminBottomNav() {
	const { t } = useTranslation();
	const location = useLocation();
	const bottomItems = [
		{
			to: "/adm",
			label: t("admin.dashboard"),
			icon: <DashboardIcon className="admin-nav__icon" />,
		},
		{
			to: "/adm/orders",
			label: t("admin.live_orders"),
			icon: <LiveOrdersIcon className="admin-nav__icon" />,
		},
		{
			to: "/adm/menu",
			label: t("admin.menu_editor"),
			icon: <MenuEditorIcon className="admin-nav__icon" />,
		},
		{
			to: "/adm/special",
			label: t("admin.daily_special"),
			icon: <DailySpecialIcon className="admin-nav__icon" />,
		},
		{
			to: "/adm/customers",
			label: t("admin.customers"),
			icon: <CustomersIcon className="admin-nav__icon" />,
		},
	];

	return (
		<nav className="admin-bottom-nav">
			{bottomItems.map((item) => (
				<Link
					key={item.to}
					to={item.to}
					aria-label={item.label}
					className={`admin-bottom-nav__item${location.pathname === item.to ? " admin-bottom-nav__item--active" : ""}`}
				>
					{item.icon}
				</Link>
			))}
		</nav>
	);
}
