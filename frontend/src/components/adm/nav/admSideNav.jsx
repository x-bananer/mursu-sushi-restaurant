import React from "react";
import { Link, useLocation } from "react-router";
import "../../shared/nav/nav.css";
import {
	DashboardIcon,
	LiveOrdersIcon,
	MenuEditorIcon,
	DailySpecialIcon,
	CustomersIcon,
	SettingsIcon,
} from "../../shared/nav/icons";

const sidebarItems = [
	{ to: "/adm", label: "Dashboard", icon: <DashboardIcon className="admin-nav__icon" /> },
	{ to: "/adm/orders", label: "Live Orders", icon: <LiveOrdersIcon className="admin-nav__icon" /> },
	{ to: "/adm/menu", label: "Menu Editor", icon: <MenuEditorIcon className="admin-nav__icon" /> },
	{ to: "/adm/special", label: "Daily Special", icon: <DailySpecialIcon className="admin-nav__icon" /> },
	{ to: "/adm/customers", label: "Customers", icon: <CustomersIcon className="admin-nav__icon" /> },
	{ to: "/adm/settings", label: "Settings", icon: <SettingsIcon className="admin-nav__icon" /> },
];

export default function AdminSideNav({ collapsed, setCollapsed }) {
	const location = useLocation();

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
				aria-label="Toggle sidebar"
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
