import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import "../../shared/nav/nav.css";
import {
	DashboardIcon,
	LiveOrdersIcon,
	MenuEditorIcon,
	DailySpecialIcon,
	CustomersIcon,
} from "../../shared/nav/icons";

export default function AdminSideNav({ collapsed, setCollapsed }) {
	const { t } = useTranslation();
	const location = useLocation();
	const sidebarItems = [
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
		<>
			<aside className="admin-sidebar">
				<nav className="admin-nav">
					{sidebarItems.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							data-tooltip={item.label}
							className={`admin-nav__item${
								location.pathname.startsWith(item.to)
									? " admin-nav__item--active"
									: ""
							}`}
						>
							{item.icon}
							<span className="admin-nav__label">
								{item.label}
							</span>
						</Link>
					))}
				</nav>
			</aside>

			<button
				className="sidebar-toggle-btn"
				onClick={() => setCollapsed((c) => !c)}
				aria-label={t("nav.toggle_sidebar")}
				style={{ left: collapsed ? "48px" : "180px" }}
			>
				<svg
					className={`sidebar-toggle-btn__icon${
						collapsed ? " sidebar-toggle-btn__icon--flipped" : ""
					}`}
					viewBox="0 0 24 24"
					fill="none"
					width="12"
					height="12"
				>
					<path
						d="M15 18L9 12L15 6"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</>
	);
}
